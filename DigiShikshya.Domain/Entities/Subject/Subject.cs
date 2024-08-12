public class Subject: Base
{
    public Guid CourseSemesterId { get; set; }
    public string? SubjectName { get; set; }
    public string? SubjectCode { get; set; }
    public string? SubjectDescription { get; set; }
    public int CreditHour { get; set; }
}