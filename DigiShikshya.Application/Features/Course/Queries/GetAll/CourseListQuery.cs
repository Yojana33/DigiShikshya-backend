using MediatR;

public class CourseListQuery : IRequest<PaginatedResult<CourseListResponse>>
{
    public int Page = 1;
    public int PageSize = 10;

}

