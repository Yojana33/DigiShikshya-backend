using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class EnrollmentListHandler : IRequestHandler<EnrollmentListQuery, PaginatedResult<EnrollmentListResponse>>
{
    private readonly IStudentEnrollmentRepository _studentEnrollmentRepository;

    public EnrollmentListHandler(IStudentEnrollmentRepository studentEnrollmentRepository)
    {
        _studentEnrollmentRepository = studentEnrollmentRepository;
    }

    public async Task<PaginatedResult<EnrollmentListResponse>> Handle(EnrollmentListQuery request, CancellationToken cancellationToken)
    {
        var enrollments = await _studentEnrollmentRepository.GetAllStudentEnrollments(request);

        var response = new PaginatedResult<EnrollmentListResponse>
        {
            Items = enrollments?.Items?.Select(x => new EnrollmentListResponse
            {
                Id = x.Id,
                StudentId = x.StudentId,
                BatchId = x.BatchId,
                SemesterId = x.SemesterId,
                EnrolledDate = x.EnrolledDate,
                StudentName = x.StudentName,
                BatchStartDate = x.BatchStartDate,
                SemesterName = x.SemesterName,
                CourseName = x.CourseName
            }).ToList(),
            Page = enrollments!.Page,
            PageSize = enrollments.PageSize,
            TotalCount = enrollments.TotalCount,
            TotalPages = enrollments.TotalPages
        };

        return response;
    }
}
