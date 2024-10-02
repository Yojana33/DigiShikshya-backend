using MediatR;

public class DeleteEnrollment : IRequest<DeleteEnrollmentResponse>
{
    public required Guid Id { get; set; }
}
