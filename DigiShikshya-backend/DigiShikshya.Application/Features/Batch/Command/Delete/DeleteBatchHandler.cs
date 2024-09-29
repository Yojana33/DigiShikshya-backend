using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class DeleteBatchHandler : IRequestHandler<DeleteBatch, DeleteBatchResponse>
{
    private readonly IBatchRepository _batchRepository;

    public DeleteBatchHandler(IBatchRepository batchRepository)
    {
        _batchRepository = batchRepository;
    }

    public async Task<DeleteBatchResponse> Handle(DeleteBatch request, CancellationToken cancellationToken)
    {
        var batch = await _batchRepository.GetBatchById(request.Id);
        if (batch == null)
        {
            return new DeleteBatchResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = new List<string> { "Batch not found." }
            };
        }

        var validator = new DeleteBatchValidator();
        var validationResult = validator.Validate(request);
        if (!validationResult.IsValid)
        {
            return new DeleteBatchResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList()
            };
        }

        var success = await _batchRepository.DeleteBatch(request.Id);
        return new DeleteBatchResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Batch deleted successfully." : "Failed to delete batch.",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later." }
        };
    }
}
