using MediatR;

public class AddNewBatch : IRequest<AddNewBatchResponse>
{
    public Guid CourseId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public StatusEnum Status { get; set; }
}
