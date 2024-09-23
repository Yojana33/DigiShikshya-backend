using MediatR;

public class MaterialListQuery : IRequest<PaginatedResult<MaterialListResponse>>
{
    public int Page = 1;
    public int PageSize = 10;

}