using MediatR;
using System;

public class UpdateTeacherAssign : IRequest<UpdateTeacherAssignResponse>
{
    public required Guid Id { get; set; }
    public Guid NewTeacherId { get; set; }
    public Guid NewSubjectId { get; set; }
}
