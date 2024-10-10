using MediatR;

public class BatchListQuery : IRequest<PaginatedResult<BatchListResponse>>
{
    public int Page { get; set; } =1;
    public int PageSize { get; set; } =10;
}
