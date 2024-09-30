using MediatR;

public class TeacherAssignListQuery : IRequest<PaginatedResult<TeacherAssignListResponse>>
{
    public int Page = 1;
    public int PageSize = 10;

}