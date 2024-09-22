using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class SubjectListHandler(ISubjectRepository _subjectRepository) : IRequestHandler<SubjectListQuery, PaginatedResult<SubjectListResponse>>
{
    public async Task<PaginatedResult<SubjectListResponse>> Handle(SubjectListQuery request, CancellationToken cancellationToken)
    {
        var subjects = await _subjectRepository.GetAllSubjects(request);

        var response = new PaginatedResult<SubjectListResponse>
        {
            Items = subjects?.Items?.Select(x => new SubjectListResponse
            {
                Id = x.Id,
                SubjectName = x.SubjectName,
                SubjectCode = x.SubjectCode,
                SubjectDescription = x.SubjectDescription,
                CreditHour = x.CreditHour,
                SemesterId = x.SemesterId,
                BatchId = x.BatchId,
                CourseName = x.CourseName,
                SemesterName = x.SemesterName, 
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt,
                CreatedBy = x.CreatedBy,
                UpdatedBy = x.UpdatedBy,
                IsActive = x.IsActive
            }).ToList(),
            Page = subjects!.Page,
            PageSize = subjects.PageSize,
            TotalCount = subjects.TotalCount,
            TotalPages = subjects.TotalPages
        };

        return response;
    }
}
