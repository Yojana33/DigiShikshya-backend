public class UpdateCourseResponse
{
    public string? Message { get; set; }

    public DateTime? RequetedAt { get; set; } = DateTime.Now;
    public string? Status { get; set; }
    public List<string>? Errors { get; set; }

}