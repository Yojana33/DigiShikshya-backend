using MediatR;
using System;

public class UpdateAssignment : IRequest<UpdateAssignmentResponse>
{
    public required Guid Id { get; set; }
    public Guid NewSubjectId { get; set; }
    public string? NewTitle { get; set; }
    public string? NewDescription { get; set; }
    public DateTime NewDueDate { get; set; }
}
