using MediatR;
using Microsoft.AspNetCore.Http;

public class AddNewSubmission : IRequest<AddNewSubmissionResponse>
{
    public Guid AssignmentId { get; set; }
    public Guid StudentId { get; set; }
    public IFormFile? SubmittedFile { get; set; }
}
