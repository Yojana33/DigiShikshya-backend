using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class SubmissionListHandler : IRequestHandler<SubmissionListQuery, PaginatedResult<SubmissionListResponse>>
{
    private readonly ISubmissionRepository _submissionRepository;
    private readonly IAssignmentRepository _assignmentRepository;

    public SubmissionListHandler(ISubmissionRepository submissionRepository, IAssignmentRepository assignmentRepository)
    {
        _submissionRepository = submissionRepository;
        _assignmentRepository = assignmentRepository;
    }

    public async Task<PaginatedResult<SubmissionListResponse>> Handle(SubmissionListQuery request, CancellationToken cancellationToken)
    {
        var submissions = await _submissionRepository.GetAllSubmissions(request);

        var response = new PaginatedResult<SubmissionListResponse>
        {
            Items = submissions?.Items?.Select(x => new SubmissionListResponse
            {
                Id = x.Id,
                AssignmentId = x.AssignmentId,
                StudentId = x.StudentId,
                SubmittedFile = x.SubmittedFile,
                SubmittedAt = x.SubmittedAt,
                Status = x.Status,
                AssignmentTitle = x.AssignmentTitle,
                DueDate = x.DueDate,
                SubjectName = x.SubjectName,
                TeacherName = x.TeacherName,
                BatchName = x.BatchName,
                CourseName = x.CourseName,
                SemesterName = x.SemesterName
            }).ToList(),
            Page = submissions!.Page,
            PageSize = submissions.PageSize,
            TotalCount = submissions.TotalCount,
            TotalPages = submissions.TotalPages
        };

        return response;
    }
}
