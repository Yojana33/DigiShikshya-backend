public class AssignmentListResponse
{
    public Guid Id { get; set; }
    public Guid SubjectId { get; set; }
    public Guid TeacherId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
}
