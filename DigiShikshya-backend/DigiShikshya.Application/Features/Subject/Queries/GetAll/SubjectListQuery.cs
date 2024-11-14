using MediatR;

public class SubjectListQuery : IRequest<PaginatedResult<SubjectListResponse>>
{
    public int Page = 1;
    public int PageSize = 10;
    //public string SemesterId { get; set; }

}