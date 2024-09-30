using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;

public class AddNewTeacherAssignHandler(ITeacherAssignRepository _teacherAssignRepository) : IRequestHandler<AddNewTeacherAssign, AddNewTeacherAssignResponse>
{
    public async Task<AddNewTeacherAssignResponse> Handle(AddNewTeacherAssign request, CancellationToken cancellationToken)
    {
        var validator = new AddNewTeacherAssignValidator();
        var validationResult = validator.Validate(request);

        if (!validationResult.IsValid)
        {
            return new AddNewTeacherAssignResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList()
            };
        }

        var teacherAssignment = new TeacherAssign
        {
            TeacherId = request.TeacherId,
            SubjectId = request.SubjectId
        };

        var success = await _teacherAssignRepository.AssignTeacher(teacherAssignment);

        return new AddNewTeacherAssignResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Teacher assigned successfully" : "Failed to assign teacher",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later" }
        };
    }
}
