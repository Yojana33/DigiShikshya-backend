using MediatR;

public class DeleteBatch : IRequest<DeleteBatchResponse>
{
    public required Guid Id { get; set; }
}