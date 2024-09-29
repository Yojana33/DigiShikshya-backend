public class Submission : Base
{
    public Guid AssignmentId { get; set; }
    public Guid StudentId { get; set; }
    public DateTime SubmittedDate { get; set; }
    public byte[]? SubmittedFile { get; set; }
    public bool Status { get; set; }
}
