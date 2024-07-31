public class DeleteSemesterResponse
{
    public List<string>? Message { get; set; }

    public DateTime? RequestedAt { get; set; } = DateTime.Now;

    public string? Status { get; set; }
    public bool? IsSuccess { get; set; }
}
