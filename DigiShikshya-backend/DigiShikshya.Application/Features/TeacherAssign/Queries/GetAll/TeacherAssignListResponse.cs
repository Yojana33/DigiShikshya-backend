public class TeacherAssignListResponse
{
    public Guid Id { get; set; }
    public Guid TeacherId { get; set; }
    public Guid SubjectId { get; set; }
    public string? SubjectName { get; set; }
    public string? TeacherName { get; set; }

    public string? BatchName { get; set; }
    public string? CourseName { get; set; }
    public string? SemesterName { get; set; }
}
