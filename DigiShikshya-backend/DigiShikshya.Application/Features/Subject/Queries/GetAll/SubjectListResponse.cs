public class SubjectListResponse
{
    public Guid Id { get; set; }
    public Guid SemesterId { get; set; }
    public Guid BatchId { get; set; }
    public string? CourseName { get; set; }
    public string? SemesterName { get; set; }
    public string? SubjectName { get; set; }
    public string? SubjectCode { get; set; }
    public string? SubjectDescription { get; set; }
    public int CreditHour { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
    public bool IsActive { get; set; }
}
