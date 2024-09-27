public interface IAssignmentRepository
{
    Task<PaginatedResult<AssignmentListResponse>> GetAllAssignments(AssignmentListQuery request);
    Task<Assignment> GetAssignmentById(Guid id);
    Task<bool> AddAssignment(Assignment assignment);
    Task<bool> UpdateAssignment(Assignment assignment);
    Task<bool> DeleteAssignment(Guid id);
}
