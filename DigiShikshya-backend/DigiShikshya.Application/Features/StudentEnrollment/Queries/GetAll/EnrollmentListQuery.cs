using MediatR;

public class EnrollmentListQuery : IRequest<PaginatedResult<EnrollmentListResponse>>
{
    public int Page = 1;
    public int PageSize = 10;

}