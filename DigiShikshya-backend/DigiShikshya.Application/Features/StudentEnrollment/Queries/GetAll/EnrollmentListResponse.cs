public class EnrollmentListResponse
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public Guid BatchId { get; set; }
    public Guid SemesterId { get; set; }
    public DateTime EnrolledDate { get; set; }

    public string? StudentName { get; set; }
    public DateTime? BatchStartDate { get; set; }
    public string? SemesterName { get; set; }
    public string? CourseName { get; set; }
}
