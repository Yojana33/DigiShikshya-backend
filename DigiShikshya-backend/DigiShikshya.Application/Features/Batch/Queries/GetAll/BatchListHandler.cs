using MediatR;

class BatchListHandler(IBatchRepository _batchRepository) : IRequestHandler<BatchListQuery, PaginatedResult<BatchListResponse>>
{
    public async Task<PaginatedResult<BatchListResponse>> Handle(BatchListQuery request, CancellationToken cancellationToken)
    {
        var batches = await _batchRepository.GetAllBatches(request);

        var response = new PaginatedResult<BatchListResponse>
        {
            Items = batches?.Items?.Select(batch => new BatchListResponse
            {
                Id = batch.Id,
                StartDate = batch.StartDate,
                EndDate = batch.EndDate,
                Status = (int)batch.Status,
                CreatedBy = batch.CreatedBy,
                UpdatedBy = batch.UpdatedBy,
                CreatedAt = batch.CreatedAt,
                UpdatedAt = batch.UpdatedAt
            }).ToList(),
            Page = batches!.Page,
            PageSize = batches.PageSize,
            TotalCount = batches.TotalCount,
            TotalPages = batches.TotalPages
        };

        return response;
    }
}
