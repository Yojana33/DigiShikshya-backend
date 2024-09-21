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

    public Task<bool> BatchAlreadyExists(DateTime startDate, DateTime endDate)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteBatch(Guid id)
    {
        throw new NotImplementedException();
    }

    public async Task<PaginatedResult<Batch>> GetAllBatches(BatchListQuery request)
    {
        var totalCount = await _dbConnection.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM batch");
        var query = "SELECT * FROM batch ORDER BY created_at DESC LIMIT @PageSize OFFSET @PageSize * (@Page - 1)";
        var result = await _dbConnection.QueryAsync<Batch>(query, new { request.PageSize, request.Page });

        return new PaginatedResult<Batch>
        {
            Items = result.ToList(),
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }


    public async Task<Batch> GetBatchById(Guid id)
    {
        var query = "SELECT * FROM batch WHERE id = @Id";
        var result = await _dbConnection.QuerySingleOrDefaultAsync<Batch>(query, new { Id = id });
        return result!;
    }


    public async Task<bool> UpdateBatch(Batch batch)
    {
        var query = @"UPDATE batch 
              SET start_date = @StartDate, 
                  end_date = @EndDate, 
                  status = @Status
              WHERE id = @Id";
        await _dbConnection.ExecuteScalarAsync<bool>(query, batch);
        return true;
    }

    // Task<bool> IBatchRepository.IsValidStatus(string status)
    // {

    // }
}
