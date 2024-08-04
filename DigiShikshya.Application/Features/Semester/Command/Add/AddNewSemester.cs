using MediatR;

public class AddNewSemester : IRequest<AddNewSemesterResponse>
{
    public string? SemesterName { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
}
