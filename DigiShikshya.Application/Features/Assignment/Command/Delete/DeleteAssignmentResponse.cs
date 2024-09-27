public class DeleteAssignmentResponse
{
    public string? Message { get; set; }

    public DateTime? RequestedAt { get; set; } = DateTime.Now;

    public string? Status { get; set; }
    public bool? IsSuccess { get; set; }

    public List<string>? Errors { get; set; }
}
