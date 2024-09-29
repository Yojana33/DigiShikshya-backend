using MediatR;

public class AssignmentListQuery : IRequest<PaginatedResult<AssignmentListResponse>>
{
    public int Page { get; set; }
    public int PageSize { get; set; }
}
