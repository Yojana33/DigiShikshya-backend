public class AddNewAssignmentResponse
{
    public string? Message { get; set; }

    public DateTime? RequestedAt { get; set; } = DateTime.Now;
    public string? Status { get; set; }
    public List<string>? Errors { get; set; }
}
