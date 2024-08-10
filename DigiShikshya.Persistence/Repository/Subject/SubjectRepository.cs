using System.Data;
using Dapper;
using Microsoft.Extensions.Logging;

public class SubjectRepository : ISubjectRepository
{
    public SubjectRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
        Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
    }
    private readonly IDbConnection _dbConnection;

    public async Task<bool> AddSubject(Subject subject)
    {
        var query = "INSERT INTO subject (id, subject_name, subject_code, subject_description, credit_hour, course_semester_id, created_at) VALUES (@Id, @SubjectName, @SubjectCode, @SubjectDescription, @CreditHour, @CourseSemesterId, @CreatedAt)";
        await _dbConnection.ExecuteScalarAsync<bool>(query, subject);

        return true;
    }

    public async Task<PaginatedResult<SubjectListResponse>> GetAllSubjects(SubjectListQuery request)
    {
        var totalCountQuery = "SELECT COUNT(*) FROM subject";
        var totalCount = await _dbConnection.ExecuteScalarAsync<int>(totalCountQuery);

        var query = @"
    SELECT s.id AS Id, s.subject_name AS SubjectName, s.subject_code AS SubjectCode, 
           s.subject_description AS SubjectDescription, s.credit_hour AS CreditHour, 
           cs.id AS CourseSemesterId,  -- Include course_semester_id
           sem.semester_name AS SemesterName, 
           c.course_name AS CourseName, 
           s.created_at AS CreatedAt, s.updated_at AS UpdatedAt 
    FROM subject s
    INNER JOIN course_semester cs ON s.course_semester_id = cs.id
    INNER JOIN semester sem ON cs.semester_id = sem.id
    INNER JOIN course c ON cs.course_id = c.id
    ORDER BY s.created_at DESC 
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

        var result = await _dbConnection.QueryAsync<SubjectListResponse>(query, new
        {
            Offset = (request.Page - 1) * request.PageSize,
            PageSize = request.PageSize
        });

        return new PaginatedResult<SubjectListResponse>
        {
            Items = result.ToList(),
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }


    public async Task<SubjectListResponse> GetSubjectById(Guid id)
    {
        var query = @"
    SELECT s.id AS Id, s.subject_name AS SubjectName, s.subject_code AS SubjectCode, 
           s.subject_description AS SubjectDescription, s.credit_hour AS CreditHour, 
           cs.id AS CourseSemesterId,  -- Include course_semester_id
           sem.semester_name AS SemesterName, 
           c.course_name AS CourseName, 
           s.created_at AS CreatedAt, s.updated_at AS UpdatedAt 
    FROM subject s
    INNER JOIN course_semester cs ON s.course_semester_id = cs.id
    INNER JOIN semester sem ON cs.semester_id = sem.id
    INNER JOIN course c ON cs.course_id = c.id
    WHERE s.id = @Id";

        var result = await _dbConnection.QuerySingleOrDefaultAsync<SubjectListResponse>(query, new { Id = id });
        return result!;
    }

    //


    public async Task<bool> UpdateSubject(Subject subject)
    {
        var query = @"
        UPDATE subject 
        SET 
            subject_name = @SubjectName, 
            subject_code = @SubjectCode, 
            subject_description = @SubjectDescription, 
            credit_hour = @CreditHour, 
            course_semester_id = @CourseSemesterId, 
            updated_at = @UpdatedAt 
        WHERE id = @Id";

        var result = await _dbConnection.ExecuteAsync(query, subject);
        return result > 0;
    }


    public Task<bool> DeleteSubject(Guid id)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> SubjectAlreadyExists(string subjectName)
    {
        var query = "SELECT COUNT(*) FROM subject WHERE subject_name = @SubjectName";
        var count = await _dbConnection.ExecuteScalarAsync<int>(query, new { SubjectName = subjectName });
        return count > 0;
    }

}