using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

class AssignmentListHandler(IAssignmentRepository _assignmentRepository) : IRequestHandler<AssignmentListQuery, PaginatedResult<AssignmentListResponse>>
{
    public async Task<PaginatedResult<AssignmentListResponse>> Handle(AssignmentListQuery request, CancellationToken cancellationToken)
    {
        var assignments = await _assignmentRepository.GetAllAssignments(request);

        var response = new PaginatedResult<AssignmentListResponse>
        {
            Items = assignments?.Items?.Select(assignment => new AssignmentListResponse
            {
                Id = assignment.Id,
                SubjectId = assignment.SubjectId,
                Title = assignment.Title,
                Description = assignment.Description,
                DueDate = assignment.DueDate,
                CreatedAt = assignment.CreatedAt,
                UpdatedAt = assignment.UpdatedAt,
                CreatedBy = assignment.CreatedBy,
                UpdatedBy = assignment.UpdatedBy
            }).ToList(),
            Page = assignments!.Page,
            PageSize = assignments.PageSize,
            TotalCount = assignments.TotalCount,
            TotalPages = assignments.TotalPages
        };

        return response;
    }
}
