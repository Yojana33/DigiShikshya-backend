public class SubmissionListResponse
{
    public Guid Id { get; set; }
    public Guid AssignmentId { get; set; }
    public Guid StudentId { get; set; }
    public byte[]? SubmittedFile { get; set; }
    public DateTime SubmittedAt { get; set; }
    public bool Status { get; set; }

    public string? AssignmentTitle { get; set; }
    public DateTime DueDate { get; set; }
    public string? SubjectName { get; set; }
    public string? TeacherName { get; set; }

    public string? BatchName { get; set; }
    public string? CourseName { get; set; }
    public string? SemesterName { get; set; }
}
