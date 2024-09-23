public class Material : Base
{
    public Guid SubjectId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? ContentType { get; set; }
    public byte[]? Content { get; set; }
    public DateTime UploadDate { get; set; }
    public string? UploadedBy { get; set; }
}
