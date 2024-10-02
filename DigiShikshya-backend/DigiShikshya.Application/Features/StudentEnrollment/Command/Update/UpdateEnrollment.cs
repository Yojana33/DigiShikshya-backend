using MediatR;
using System;

public class UpdateEnrollment : IRequest<UpdateEnrollmentResponse>
{
    public required Guid Id { get; set; }
    public Guid NewStudentId { get; set; }
    public Guid NewBatchId { get; set; }
    public Guid NewSemesterId { get; set; }
    public DateTime NewEnrolledDate { get; set; }
}
