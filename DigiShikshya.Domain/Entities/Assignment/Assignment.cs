public class Assignment : Base
{
    public Guid SubjectId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime DueDate { get; set; }
}
