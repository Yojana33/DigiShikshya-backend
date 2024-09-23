using MediatR;

public class AddNewBatch : IRequest<AddNewBatchResponse>
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public StatusEnum Status { get; set; }
}
