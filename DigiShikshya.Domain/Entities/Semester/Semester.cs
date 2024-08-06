public class Semester : Base
{
    public Guid CourseId { get; set; }
    public string? SemesterName { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
