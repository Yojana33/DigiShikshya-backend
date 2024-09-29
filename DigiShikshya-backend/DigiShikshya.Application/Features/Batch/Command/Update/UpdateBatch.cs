using MediatR;

public class UpdateBatch : IRequest<UpdateBatchResponse>
{
    public required Guid Id { get; set; }

    public DateTime NewStartDate { get; set; }
    public DateTime NewEndDate { get; set; }
    public StatusEnum NewStatus { get; set; }
}