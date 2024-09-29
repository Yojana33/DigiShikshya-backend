using MediatR;

public class AddNewAssignment : IRequest<AddNewAssignmentResponse>
{
    public Guid SubjectId { get; set; }
    public Guid TeacherId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime DueDate { get; set; }
    public string? UploadedBy { get; set; }
}
