using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

public class DeleteAssignmentHandler(IAssignmentRepository assignmentRepository) : IRequestHandler<DeleteAssignment, DeleteAssignmentResponse>
{
    public async Task<DeleteAssignmentResponse> Handle(DeleteAssignment request, CancellationToken cancellationToken)
    {
        // Check if the assignment exists
        var assignment = await assignmentRepository.GetAssignmentById(request.Id);
        if (assignment == null)
        {
            return new DeleteAssignmentResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = new List<string> { "Assignment not found." }
            };
        }

        // Validate the request
        var validator = new DeleteAssignmentValidator();
        var validationResult = validator.Validate(request);
        if (!validationResult.IsValid)
        {
            return new DeleteAssignmentResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList()
            };
        }

        // Attempt to delete the assignment
        var success = await assignmentRepository.DeleteAssignment(request.Id);
        return new DeleteAssignmentResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Assignment deleted successfully." : "Failed to delete assignment.",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later." }
        };
    }
}
