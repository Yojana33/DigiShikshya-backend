using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

class SemesterListHandler(ISemesterRepository _semesterRepository) : IRequestHandler<SemesterListQuery, PaginatedResult<SemesterListResponse>>
{
    public async Task<PaginatedResult<SemesterListResponse>> Handle(SemesterListQuery request, CancellationToken cancellationToken)
    {
        var semesters = await _semesterRepository.GetAllSemesters(request);

        var response = new PaginatedResult<SemesterListResponse>
        {
            Items = semesters?.Items?.Select(x => new SemesterListResponse
            {
                Id = x.Id,
                SemesterName = x.SemesterName,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt,
                CreatedBy = x.CreatedBy,
                UpdatedBy = x.UpdatedBy,
                IsActive = x.IsActive

            }).ToList(),
            Page = semesters!.Page,
            PageSize = semesters.PageSize,
            TotalCount = semesters.TotalCount,
            TotalPages = semesters.TotalPages
        };

        return response;
    }
}
