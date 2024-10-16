using MediatR;

public class UpdateBatchHandler(IBatchRepository _batchRepository) : IRequestHandler<UpdateBatch, UpdateBatchResponse>
{
    public async Task<UpdateBatchResponse> Handle(UpdateBatch request, CancellationToken cancellationToken)
    {
        var response = new UpdateBatchResponse();
        var validator = new UpdateBatchValidator();
        var validationResult = validator.Validate(request);

        if (!validationResult.IsValid)
        {
            response.Status = "Bad Request";
            response.Message = "Validation failed";
            response.Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList();
            return response;
        }

        var existingBatch = await _batchRepository.GetBatchById(request.Id);
        if (existingBatch == null)
        {
            response.Status = "Bad Request";
            response.Message = "Validation failed";
            response.Errors = new List<string> { "Batch not found." };
            return response;
        }

        // if (request.NewStatus != existingBatch.Status)
        // {
        //     // Assuming the status might need unique validation or some business logic check.
        //     var statusIsValid = await _batchRepository.IsValidStatus(request.NewStatus);
        //     if (!statusIsValid)
        //     {
        //         return new UpdateBatchResponse
        //         {
        //             Status = "Bad Request",
        //             Message = "Validation failed",
        //             Errors = new List<string> { "Invalid status value provided." }
        //         };
        //     }
        // }

        var updateBatch = new Batch
        {
            Id = request.Id,
            StartDate = request.NewStartDate,
            EndDate = request.NewEndDate,
            Status = (StatusEnum)request.NewStatus,
           
        };

        var success = await _batchRepository.UpdateBatch(updateBatch);
        return new UpdateBatchResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Batch updated successfully" : "Failed to update batch",
            Errors = success ? [""] : ["Something went wrong, please try again later"]
        };
    }
}
