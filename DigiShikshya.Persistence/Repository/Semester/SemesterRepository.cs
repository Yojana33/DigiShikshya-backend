using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;

public class SemesterRepository : ISemesterRepository
{

    // public async Task<bool> AddSemester(Semester semester)
    // {
    //     var query = @"INSERT INTO semester 
    //                   (id, semester_name, course_id, start_date, end_date, created_at) 
    //                   VALUES 
    //                   (@Id, @SemesterName, @CourseID, @StartDate, @EndDate, @CreatedAt)";

    //     var result = await _dbConnection.ExecuteAsync(query, semester);
    //     return result > 0;
    // }

    public SemesterRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
        Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
    }
    private readonly IDbConnection _dbConnection;
    public async Task<bool> AddSemester(Semester semester)
    {
        // Ensure the CreatedAt property is set
        semester.CreatedAt = DateTime.UtcNow;

        var semesterQuery = @"INSERT INTO semester 
                          (id, semester_name, course_id, start_date, end_date, created_at) 
                          VALUES 
                          (@Id, @SemesterName, @CourseId, @StartDate, @EndDate, @CreatedAt)";

        var courseSemesterQuery = @"INSERT INTO course_semester 
                                (id, course_id, semester_id, created_at) 
                                VALUES 
                                (@Id, @CourseId, @SemesterId, @CreatedAt)";

        try
        {
            // Ensure the connection is open
            if (_dbConnection.State != ConnectionState.Open)
            {
                _dbConnection.Open(); // Synchronous open method
            }

            using (var transaction = _dbConnection.BeginTransaction())
            {
                try
                {
                    // Insert into the semester table
                    var semesterResult = await _dbConnection.ExecuteAsync(semesterQuery, new
                    {
                        Id = semester.Id,
                        SemesterName = semester.SemesterName,
                        CourseId = semester.CourseId,
                        StartDate = semester.StartDate,
                        EndDate = semester.EndDate,
                        CreatedAt = semester.CreatedAt
                    }, transaction);

                    if (semesterResult <= 0)
                    {
                        throw new Exception("Failed to insert into semester table.");
                    }

                    // Insert into the course_semester table
                    var courseSemester = new CourseSemester
                    {
                        Id = Guid.NewGuid(), // Generate a new ID for course_semester
                        CourseId = semester.CourseId,
                        SemesterId = semester.Id,
                        CreatedAt = semester.CreatedAt
                    };

                    var courseSemesterResult = await _dbConnection.ExecuteAsync(courseSemesterQuery, new
                    {
                        Id = courseSemester.Id,
                        CourseId = courseSemester.CourseId,
                        SemesterId = courseSemester.SemesterId,
                        CreatedAt = courseSemester.CreatedAt
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
                    throw;
                }
            }
        }
        catch (Exception ex)
        {
            // Log the exception or handle it as necessary
            // For example: _logger.LogError(ex, "Error adding semester");
            return false;
        }
        finally
        {
            if (_dbConnection.State == ConnectionState.Open)
            {
                _dbConnection.Close();
            }
        }
    }



    public async Task<bool> DeleteSemester(Guid id)
    {
        var query = "DELETE FROM semester WHERE id = @Id";
        var result = await _dbConnection.ExecuteAsync(query, new { Id = id });
        return result > 0;
    }

    public async Task<PaginatedResult<Semester>> GetAllSemesters(SemesterListQuery request)
    {
        var totalCountQuery = "SELECT COUNT(*) FROM semester";
        var totalCount = await _dbConnection.ExecuteScalarAsync<int>(totalCountQuery);

        var query = @"SELECT * FROM semester 
                      ORDER BY created_at DESC 
                      OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

        var result = await _dbConnection.QueryAsync<Semester>(query, new
        {
            Offset = (request.Page - 1) * request.PageSize,
            PageSize = request.PageSize
        });

        return new PaginatedResult<Semester>
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
        var query = "SELECT * FROM semester WHERE id = @Id";
        var result = await _dbConnection.QuerySingleOrDefaultAsync<Semester>(query, new { Id = id });
        return result!;
    }

    public async Task<bool> UpdateSemester(Semester semester)
    {
        var query = @"UPDATE semester 
                      SET semester_name = @SemesterName, 
                          start_date = @StartDate, 
                          end_date = @EndDate,
                          updated_at = @UpdatedAt
                      WHERE id = @Id";

        var result = await _dbConnection.ExecuteAsync(query, semester);
        return result > 0;
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