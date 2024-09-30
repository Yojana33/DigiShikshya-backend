using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

public class DeleteTeacherAssignHandler : IRequestHandler<DeleteTeacherAssign, DeleteTeacherAssignResponse>
{
    private readonly ITeacherAssignRepository _teacherAssignRepository;

    public DeleteTeacherAssignHandler(ITeacherAssignRepository teacherAssignRepository)
    {
        _teacherAssignRepository = teacherAssignRepository;
    }

    public async Task<DeleteTeacherAssignResponse> Handle(DeleteTeacherAssign request, CancellationToken cancellationToken)
    {
        // Check if the teacher assignment exists
        var teacherAssign = await _teacherAssignRepository.GetTeacherAssignmentById(request.Id);
        if (teacherAssign == null)
        {
            return new DeleteTeacherAssignResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = new List<string> { "Teacher assignment not found." }
            };
        }

        // Validate the request
        var validator = new DeleteTeacherAssignValidator();
        var validationResult = validator.Validate(request);
        if (!validationResult.IsValid)
        {
            return new DeleteTeacherAssignResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList()
            };
        }

        // Attempt to delete the teacher assignment
        var success = await _teacherAssignRepository.DeleteTeacherAssignment(request.Id);
        return new DeleteTeacherAssignResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Teacher assignment deleted successfully." : "Failed to delete teacher assignment.",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later." }
        };
    }
}
