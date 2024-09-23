public class MaterialListResponse
{
    public Guid Id { get; set; }
    public Guid SubjectId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? ContentType { get; set; }
    public byte[]? Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
    public bool IsActive { get; set; }
}