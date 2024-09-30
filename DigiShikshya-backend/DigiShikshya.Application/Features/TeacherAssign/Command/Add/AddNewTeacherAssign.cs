using MediatR;

public class AddNewTeacherAssign : IRequest<AddNewTeacherAssignResponse>
{
    public Guid TeacherId { get; set; }
    public Guid SubjectId { get; set; }
}
