using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;

public class AddNewAssignmentHandler(IAssignmentRepository _assignmentRepository) : IRequestHandler<AddNewAssignment, AddNewAssignmentResponse>
{
    public async Task<AddNewAssignmentResponse> Handle(AddNewAssignment request, CancellationToken cancellationToken)
    {
        var validator = new AddNewAssignmentValidator();
        var validationResult = validator.Validate(request);

        if (!validationResult.IsValid)
        {
            return new AddNewAssignmentResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList()
            };
        }

        var assignment = new Assignment
        {
            SubjectId = request.SubjectId,
            Title = request.Title,
            Description = request.Description,
            DueDate = request.DueDate,
        };

        var success = await _assignmentRepository.AddAssignment(assignment);

        return new AddNewAssignmentResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Assignment added successfully" : "Failed to add assignment",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later" }
        };
    }
}
