using System.Data;
using System.Threading.Tasks;
using Dapper;

public class BatchRepository : IBatchRepository
{
    private readonly IDbConnection _dbConnection;

    public BatchRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
        Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
    }

    public async Task<bool> AddBatch(Batch batch)
    {
        var query = "INSERT INTO batch (id, start_date, end_date, status, created_at) VALUES (@BatchId, @StartDate, @EndDate, @Status, @CreatedAt)";
        await _dbConnection.ExecuteAsync(query, batch);
        return true;
    }

    public Task<bool> BatchAlreadyExists( DateTime startDate, DateTime endDate)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteBatch(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<PaginatedResult<BatchListResponse>> GetAllBatches(BatchListQuery request)
    {
        throw new NotImplementedException();
    }

    public Task<Batch> GetBatchById(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UpdateBatch(Batch batch)
    {
        throw new NotImplementedException();
    }
}
