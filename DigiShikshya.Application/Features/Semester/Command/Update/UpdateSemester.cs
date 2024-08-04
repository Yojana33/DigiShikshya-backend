using MediatR;
using System;

public class UpdateSemester : IRequest<UpdateSemesterResponse>
{
    public required Guid Id { get; set; }
    public string? NewName { get; set; }
    public DateOnly? NewStartDate { get; set; }
    public DateOnly? NewEndDate { get; set; }
}
