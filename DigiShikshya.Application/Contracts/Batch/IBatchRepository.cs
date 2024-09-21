public interface IBatchRepository
{
    Task<PaginatedResult<Batch>> GetAllBatches(BatchListQuery request);
    Task<Batch> GetBatchById(Guid id);
    Task<bool> AddBatch(Batch batch);
    Task<bool> UpdateBatch(Batch batch);
    Task<bool> DeleteBatch(Guid id);
    Task<bool> BatchAlreadyExists( DateTime startDate, DateTime endDate);
}
