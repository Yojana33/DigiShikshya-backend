using MediatR;

public class DeleteAssignment : IRequest<DeleteAssignmentResponse>
{
    public required Guid Id { get; set; }
}
