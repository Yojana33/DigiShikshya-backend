public class Batch : Base
{
    public Guid BatchId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public Guid CourseId { get; set; }
    public int Status { get; set; }
}