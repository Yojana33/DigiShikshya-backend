using System.Data;
using Dapper;
using System.Threading.Tasks;

public class MaterialRepository : IMaterialRepository
{
    private readonly IDbConnection _dbConnection;

    public MaterialRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
        Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
    }

    public async Task<bool> AddMaterial(Material material)
    {
        const string query = @"
        INSERT INTO material (id, subject_id, title, description, content_type, content, upload_date, uploaded_by, created_at)
        VALUES (@Id, @SubjectId, @Title, @Description, @ContentType, @Content, @UploadDate, @UploadedBy, @CreatedAt)";

        await _dbConnection.ExecuteScalarAsync<bool>(query, material);

        return true;
    }

    public async Task<bool> DeleteMaterial(Guid id)
    {
        var query = "DELETE FROM material WHERE id = @Id";

        var result = await _dbConnection.ExecuteAsync(query, new { Id = id });

        return result > 0;
    }

    public Task<PaginatedResult<MaterialListResponse>> GetAllMaterials(MaterialListQuery request)
    {
        throw new NotImplementedException();
    }

    public Task<MaterialListResponse> GetMaterialById(Guid id)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> UpdateMaterial(Material material)
    {
        var query = @"
        UPDATE material 
        SET 
            subject_id = @SubjectId, 
            title = @Title, 
            description = @Description, 
            content_type = @ContentType, 
            content = @Content,
            upload_date = @UploadDate,
            uploaded_by = @UploadedBy,
            updated_at = @UpdatedAt 
        WHERE id = @Id";

        var result = await _dbConnection.ExecuteAsync(query, material);
        return result > 0;
    }
}
