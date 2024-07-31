using MediatR;

public class AddNewSemester : IRequest<AddNewSemesterResponse>
{
    public string? SemesterName { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
