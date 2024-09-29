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
        var query = "INSERT INTO subject (id, subject_name, subject_code, subject_description, credit_hour, semester_id, batch_id, created_at) VALUES (@Id, @SubjectName, @SubjectCode, @SubjectDescription, @CreditHour, @SemesterId, @BatchId, @CreatedAt)";
        await _dbConnection.ExecuteScalarAsync<bool>(query, subject);

        return true;
    }

    public async Task<PaginatedResult<SubjectListResponse>> GetAllSubjects(SubjectListQuery request)
    {
        var totalCountQuery = "SELECT COUNT(*) FROM subject";
        var totalCount = await _dbConnection.ExecuteScalarAsync<int>(totalCountQuery);

        var query = @"
    SELECT s.id AS Id, 
           s.subject_name AS SubjectName, 
           s.subject_code AS SubjectCode, 
           s.subject_description AS SubjectDescription, 
           s.credit_hour AS CreditHour, 
           sem.id AS SemesterId, 
           sem.semester_name AS SemesterName, 
           b.id AS BatchId, 
           b.start_date AS BatchStartDate, 
           b.end_date AS BatchEndDate,
           b.status AS BatchStatus,
           c.course_name AS CourseName, 
           s.created_at AS CreatedAt, 
           s.updated_at AS UpdatedAt 
    FROM subject s
    INNER JOIN batch b ON s.batch_id = b.id  -- Join with batch table
    INNER JOIN semester sem ON b.semester_id = sem.id  -- Join with semester table
    INNER JOIN course c ON sem.course_id = c.id  -- Join with course table via semester
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
    SELECT s.id AS Id, 
           s.subject_name AS SubjectName, 
           s.subject_code AS SubjectCode, 
           s.subject_description AS SubjectDescription, 
           s.credit_hour AS CreditHour, 
           sem.id AS SemesterId, 
           sem.semester_name AS SemesterName, 
           b.id AS BatchId, 
           b.start_date AS BatchStartDate, 
           b.end_date AS BatchEndDate,
           b.status AS BatchStatus,
           c.course_name AS CourseName, 
           s.created_at AS CreatedAt, 
           s.updated_at AS UpdatedAt 
    FROM subject s
    INNER JOIN batch b ON s.batch_id = b.id  -- Join with batch table
    INNER JOIN semester sem ON b.semester_id = sem.id  -- Join with semester table
    INNER JOIN course c ON sem.course_id = c.id  -- Join with course table via semester
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
            semester_id = @SemesterId,
            batch_id = @BatchId, 
            updated_at = @UpdatedAt 
        WHERE id = @Id";

        var result = await _dbConnection.ExecuteAsync(query, subject);
        return result > 0;
    }


    public async Task<bool> DeleteSubject(Guid id)
    {
        var query = "DELETE FROM subject WHERE id = @Id";

        var result = await _dbConnection.ExecuteAsync(query, new { Id = id });

        return result > 0;
    }

    public async Task<bool> SubjectAlreadyExists(string subjectName)
    {
        var query = "SELECT COUNT(*) FROM subject WHERE subject_name = @SubjectName";
        var count = await _dbConnection.ExecuteScalarAsync<int>(query, new { SubjectName = subjectName });
        return count > 0;
    }

}