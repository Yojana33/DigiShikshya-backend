public class Subject : Base
{
    public Guid SemesterId { get; set; }
    public Guid BatchId { get; set; }
    public string? SubjectName { get; set; }
    public string? SubjectCode { get; set; }
    public string? SubjectDescription { get; set; }
    public int CreditHour { get; set; }
}