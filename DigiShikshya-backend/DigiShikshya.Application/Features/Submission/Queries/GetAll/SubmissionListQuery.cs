using MediatR;

public class SubmissionListQuery : IRequest<PaginatedResult<SubmissionListResponse>>
{
    public int Page = 1;
    public int PageSize = 10;

}