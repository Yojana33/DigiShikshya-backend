using MediatR;

public class AddNewSemester : IRequest<AddNewSemesterResponse>
{
    public string? SemesterName { get; set; }
    public required DateTime StartDate { get; set; }
    public required DateTime EndDate { get; set; }
}
