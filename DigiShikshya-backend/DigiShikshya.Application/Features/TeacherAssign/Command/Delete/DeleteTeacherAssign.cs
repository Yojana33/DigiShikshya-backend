using MediatR;

public class DeleteTeacherAssign : IRequest<DeleteTeacherAssignResponse>
{
    public required Guid Id { get; set; }
}