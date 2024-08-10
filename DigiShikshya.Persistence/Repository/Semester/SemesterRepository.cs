
using System.Data;

using Dapper;

public class SemesterRepository : ISemesterRepository
{
    private readonly IDbConnection _dbConnection;

    public SemesterRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
        Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
    }


    public async Task<bool> AddSemester(Semester semester)
    {
        var semesterQuery = @"INSERT INTO semester 
                              (id, semester_name, course_id, start_date, end_date, created_at) 
                              VALUES 
                              (@Id, @SemesterName, @CourseId, @StartDate, @EndDate, @CreatedAt)";

        var courseSemesterQuery = @"INSERT INTO course_semester 
                                    (id, course_id, semester_id, created_at) 
                                    VALUES 
                                    (@Id, @CourseId, @SemesterId, @CreatedAt)";
        _dbConnection.Open();
        using var transaction = _dbConnection.BeginTransaction();
        try
        {
            // Insert into the semester table
            var semesterResult = await _dbConnection.ExecuteAsync(semesterQuery, new
            {
                semester.Id,
                semester.SemesterName,
                semester.CourseId,
                semester.StartDate,
                semester.EndDate,
                semester.CreatedAt
            }, transaction);

            if (semesterResult <= 0)
            {
                throw new Exception("Failed to insert into semester table.");
            }

            // Insert into the course_semester table
            var courseSemester = new CourseSemester
            {
                Id = Guid.NewGuid(),
                CourseId = semester.CourseId,
                SemesterId = semester.Id,
                CreatedAt = semester.CreatedAt
            };

            var courseSemesterResult = await _dbConnection.ExecuteAsync(courseSemesterQuery, new
            {
                courseSemester.Id,
                courseSemester.CourseId,
                courseSemester.SemesterId,
                courseSemester.CreatedAt
            }, transaction);

            if (courseSemesterResult <= 0)
            {
                throw new Exception("Failed to insert into course_semester table.");
            }

            // Commit the transaction if both inserts succeed
            transaction.Commit();
            return true;
        }
        catch
        {
            // Rollback the transaction if any error occurs
            transaction.Rollback();
            _dbConnection.Close();
            throw;
        }
    }

    public async Task<bool> DeleteSemester(Guid id)
    {
        var query = "DELETE FROM semester WHERE id = @Id";
        var result = await _dbConnection.ExecuteAsync(query, new { Id = id });
        return result > 0;
    }

    public async Task<PaginatedResult<SemesterListResponse>> GetAllSemesters(SemesterListQuery request)
    {
        var totalCountQuery = "SELECT COUNT(*) FROM semester";
        var totalCount = await _dbConnection.ExecuteScalarAsync<int>(totalCountQuery);

        var query = @"
        SELECT s.id, s.semester_name, s.course_id, c.course_name, s.start_date, s.end_date, s.created_at, s.updated_at 
        FROM semester s
        INNER JOIN course c ON s.course_id = c.id
        ORDER BY s.created_at DESC 
        OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

        var result = await _dbConnection.QueryAsync<SemesterListResponse>(query, new
        {
            Offset = (request.Page - 1) * request.PageSize,
            PageSize = request.PageSize
        });

        return new PaginatedResult<SemesterListResponse>
        {
            Items = result.ToList(),
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }


    public async Task<Semester> GetSemesterById(Guid id)
    {
        var query = @"
            SELECT s.id, s.semester_name, s.course_id, c.course_name, s.start_date, s.end_date, s.created_at, s.updated_at 
            FROM semester s
            INNER JOIN course c ON s.course_id = c.id
            WHERE s.id = @Id";

        var result = await _dbConnection.QuerySingleOrDefaultAsync<Semester>(query, new { Id = id });
        return result!;
    }

    public async Task<bool> UpdateSemester(Semester semester)
    {
        var semesterQuery = @"UPDATE semester 
                          SET semester_name = @SemesterName, 
                              course_id = @CourseId,
                              start_date = @StartDate, 
                              end_date = @EndDate,
                              updated_at = @UpdatedAt
                          WHERE id = @Id";

        var courseSemesterQuery = @"UPDATE course_semester 
                                SET course_id = @CourseId, 
                                    semester_id = @SemesterId, 
                                    created_at = @CreatedAt
                                WHERE semester_id = @SemesterId";

        _dbConnection.Open();
        using var transaction = _dbConnection.BeginTransaction();
        try
        {
            // Update the semester table
            var semesterResult = await _dbConnection.ExecuteAsync(semesterQuery, new
            {
                semester.Id,
                semester.SemesterName,
                semester.CourseId,
                semester.StartDate,
                semester.EndDate,
                semester.UpdatedAt
            }, transaction);

            if (semesterResult <= 0)
            {
                throw new Exception("Failed to update the semester table.");
            }

            // Update the course_semester table
            var courseSemesterResult = await _dbConnection.ExecuteAsync(courseSemesterQuery, new
            {
                CourseId = semester.CourseId,
                SemesterId = semester.Id,
                CreatedAt = semester.CreatedAt // Assuming this stays the same
            }, transaction);

            if (courseSemesterResult <= 0)
            {
                throw new Exception("Failed to update the course_semester table.");
            }

            // Commit the transaction if both updates succeed
            transaction.Commit();
            return true;
        }
        catch
        {
            // Rollback the transaction if any error occurs
            transaction.Rollback();
            _dbConnection.Close();
            throw;
        }
    }


    public async Task<bool> SemesterAlreadyExists(string semesterName)
    {
        var query = "SELECT COUNT(*) FROM semester WHERE semester_name = @SemesterName";
        var count = await _dbConnection.ExecuteScalarAsync<int>(query, new { SemesterName = semesterName });
        return count > 0;
    }
}

internal class CourseSemester
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public Guid SemesterId { get; set; }
    public DateTime CreatedAt { get; set; }
}
