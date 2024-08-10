using MediatR;

public class DeleteSubject : IRequest<DeleteSubjectResponse>
{
    public required Guid Id { get; set; }
}
