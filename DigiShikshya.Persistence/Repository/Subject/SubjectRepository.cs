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

    public Task<PaginatedResult<SubjectListResponse>> GetAllSubjects(SubjectListQuery request)
    {
        throw new NotImplementedException();
    }

    public Task<SubjectListResponse> GetSubjectById(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UpdateSubject(Subject subject)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteSubject(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<bool> SubjectAlreadyExists(string subjectName)
    {
        throw new NotImplementedException();
    }
}