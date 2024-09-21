using MediatR;

public class BatchListQuery : IRequest<PaginatedResult<BatchListResponse>>
{
    public int Page { get; set; }
    public int PageSize { get; set; }
}
