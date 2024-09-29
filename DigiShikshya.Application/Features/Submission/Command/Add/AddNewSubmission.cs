using MediatR;

public class AddNewSubmission : IRequest<AddNewSubmissionResponse>
{
    public Guid AssignmentId { get; set; }
    public Guid StudentId { get; set; }
    public byte[] SubmittedFile { get; set; }
}
