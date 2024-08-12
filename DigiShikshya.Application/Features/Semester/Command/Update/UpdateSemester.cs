using MediatR;
using System;

public class UpdateSemester : IRequest<UpdateSemesterResponse>
{
    public required Guid Id { get; set; }
    public Guid NewCourseId { get; set; }
    public string? NewName { get; set; }
    public DateTime NewStartDate { get; set; }
    public DateTime NewEndDate { get; set; }
}
