public class Semester : Base
{
    public Guid CourseId { get; set; }
    public string? SemesterName { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
}
