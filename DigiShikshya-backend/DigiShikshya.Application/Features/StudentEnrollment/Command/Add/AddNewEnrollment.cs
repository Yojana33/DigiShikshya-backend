using MediatR;

public class AddNewEnrollment : IRequest<AddNewEnrollmentResponse>
{
    public Guid StudentId { get; set; }
    public Guid BatchId { get; set; }
    public Guid SemesterId { get; set; }
    public DateTime EnrolledDate { get; set; }
}
