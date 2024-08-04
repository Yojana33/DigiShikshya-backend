using MediatR;

public class SemesterListQuery : IRequest<PaginatedResult<SemesterListResponse>>
{
    public int Page = 1;
    public int PageSize = 10;

}

