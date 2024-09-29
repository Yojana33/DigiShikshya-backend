public interface ISubmissionRepository
{
    Task<PaginatedResult<SubmissionListResponse>> GetAllSubmissions(SubmissionListQuery request);
    Task<Submission> GetSubmissionById(Guid id);
    Task<bool> AddSubmission(Submission submission);
}
