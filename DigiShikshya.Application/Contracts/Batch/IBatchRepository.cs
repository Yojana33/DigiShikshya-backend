public interface IBatchRepository
{
    Task<PaginatedResult<BatchListResponse>> GetAllBatches(BatchListQuery request);
    Task<Batch> GetBatchById(Guid id);
    Task<bool> AddBatch(Batch batch);
    Task<bool> UpdateBatch(Batch batch);
    Task<bool> DeleteBatch(Guid id);
    Task<bool> BatchAlreadyExists(Guid courseId, DateTime startDate, DateTime endDate);
}
