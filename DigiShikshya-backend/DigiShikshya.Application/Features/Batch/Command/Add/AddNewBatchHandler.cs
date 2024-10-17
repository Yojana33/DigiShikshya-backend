using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;

public class AddNewBatchHandler(IBatchRepository batchRepository, IHttpContextAccessor httpContextAccessor) : IRequestHandler<AddNewBatch, AddNewBatchResponse>
{
    public async Task<AddNewBatchResponse> Handle(AddNewBatch request, CancellationToken cancellationToken)
    {
        // Validate the request using a validator
        var validator = new AddNewBatchValidator();
        var validationResult = validator.Validate(request);

        if (!validationResult.IsValid)
        {
            return new AddNewBatchResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList()
            };
        }

        // Map the request to the Batch entity
        var batch = new Batch
        {
            BatchId = Guid.NewGuid(),  // Generate a new BatchId
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Status = (StatusEnum)request.Status,
            CreatedBy = httpContextAccessor.HttpContext?.Items["Name"]?.ToString() ?? "Unknown User",

            UpdatedAt = DateTime.Now,
            IsActive = true
        };

        // Save the batch to the database
        var success = await batchRepository.AddBatch(batch);

        // Return the response
        return new AddNewBatchResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Batch added successfully" : "Failed to add batch",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later" }
        };
    }
}
