using MediatR;

public class AddNewSubject : IRequest<AddNewSubjectResponse>
{
    public string? SubjectName { get; set; }
    public Guid SemesterId { get; set; }
    public Guid BatchId { get; set; }
    public string? SubjectCode { get; set; }
    public string? SubjectDescription { get; set; }
    public int CreditHour { get; set; }
}