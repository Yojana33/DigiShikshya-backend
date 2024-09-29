using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class DeleteSubjectHandler(ISubjectRepository _subjectRepository) : IRequestHandler<DeleteSubject, DeleteSubjectResponse>
{
    public async Task<DeleteSubjectResponse> Handle(DeleteSubject request, CancellationToken cancellationToken)
    {
        // Check if the subject exists
        var subject = await _subjectRepository.GetSubjectById(request.Id);
        if (subject == null)
        {
            return new DeleteSubjectResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = new List<string> { "Subject not found." }
            };
        }

        // Validate the request
        var validator = new DeleteSubjectValidator();
        var validationResult = validator.Validate(request);
        if (!validationResult.IsValid)
        {
            return new DeleteSubjectResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList()
            };
        }

        // Attempt to delete the subject
        var success = await _subjectRepository.DeleteSubject(request.Id);
        return new DeleteSubjectResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Subject deleted successfully." : "Failed to delete subject.",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later." }
        };
    }
}
