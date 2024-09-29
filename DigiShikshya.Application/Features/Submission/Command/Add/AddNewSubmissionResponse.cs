public class AddNewSubmissionResponse
{
    public string? Message { get; set; }
    public DateTime? SubmittedAt { get; set; } = DateTime.Now;
    public string? Status { get; set; }
    public List<string>? Errors { get; set; }
}
