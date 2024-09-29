public interface ISubjectRepository
{
    Task<PaginatedResult<SubjectListResponse>> GetAllSubjects(SubjectListQuery request);
    Task<SubjectListResponse> GetSubjectById(Guid id);
    Task<bool> AddSubject(Subject subject);
    Task<bool> UpdateSubject(Subject subject);
    Task<bool> DeleteSubject(Guid id);
    Task<bool> SubjectAlreadyExists(string subjectName);
}