using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class TeacherAssignListHandler : IRequestHandler<TeacherAssignListQuery, PaginatedResult<TeacherAssignListResponse>>
{
    private readonly ITeacherAssignRepository _teacherAssignRepository;

    public TeacherAssignListHandler(ITeacherAssignRepository teacherAssignRepository)
    {
        _teacherAssignRepository = teacherAssignRepository;
    }

    public async Task<PaginatedResult<TeacherAssignListResponse>> Handle(TeacherAssignListQuery request, CancellationToken cancellationToken)
    {
        // Fetch the list of teacher assignments based on the provided query.
        var teacherAssignments = await _teacherAssignRepository.GetAllTeacherAssignments(request);

        // Map the teacher assignments to the response model.
        var response = new PaginatedResult<TeacherAssignListResponse>
        {
            Items = teacherAssignments?.Items?.Select(x => new TeacherAssignListResponse
            {
                Id = x.Id,
                TeacherId = x.TeacherId,
                SubjectId = x.SubjectId,
                SubjectName = x.SubjectName,
                TeacherName = x.TeacherName,
                BatchName = x.BatchName,
                CourseName = x.CourseName,
                SemesterName = x.SemesterName
            }).ToList(),
            Page = teacherAssignments!.Page,
            PageSize = teacherAssignments.PageSize,
            TotalCount = teacherAssignments.TotalCount,
            TotalPages = teacherAssignments.TotalPages
        };

        return response;
    }
}
