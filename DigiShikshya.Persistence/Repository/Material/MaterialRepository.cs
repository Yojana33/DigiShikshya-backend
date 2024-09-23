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

    public async Task<PaginatedResult<MaterialListResponse>> GetAllMaterials(MaterialListQuery request)
    {
        var totalCountQuery = "SELECT COUNT(*) FROM material";
        var totalCount = await _dbConnection.ExecuteScalarAsync<int>(totalCountQuery);

        var query = @"
        SELECT m.id AS Id,
               m.subject_id AS SubjectId,
               m.title AS Title,
               m.description AS Description,
               m.content_type AS ContentType,
               m.content AS Content,
               m.upload_date AS UploadDate,
               m.uploaded_by AS UploadedBy,
               m.created_at AS CreatedAt,
               m.updated_at AS UpdatedAt,
               s.subject_name AS SubjectName,
               b.batch_name AS BatchName,
               sem.semester_name AS SemesterName,
               c.course_name AS CourseName
        FROM material m
        INNER JOIN subject s ON m.subject_id = s.id
        INNER JOIN batch b ON s.batch_id = b.id 
        INNER JOIN semester sem ON s.semester_id = sem.id
        INNER JOIN course c ON sem.course_id = c.id
        ORDER BY m.created_at DESC 
        OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

        var result = await _dbConnection.QueryAsync<MaterialListResponse>(query, new
        {
            Offset = (request.Page - 1) * request.PageSize,
            PageSize = request.PageSize
        });

        return new PaginatedResult<MaterialListResponse>
        {
            Items = result.ToList(),
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }



    public async Task<MaterialListResponse> GetMaterialById(Guid id)
    {
        var query = @"
        SELECT m.id AS Id,
               m.subject_id AS SubjectId,
               m.title AS Title,
               m.description AS Description,
               m.content_type AS ContentType,
               m.content AS Content,
               m.upload_date AS UploadDate,
               m.uploaded_by AS UploadedBy,
               m.created_at AS CreatedAt,
               m.updated_at AS UpdatedAt,
               s.subject_name AS SubjectName,
               b.batch_name AS BatchName,
               sem.semester_name AS SemesterName,
               c.course_name AS CourseName
        FROM material m
        INNER JOIN subject s ON m.subject_id = s.id
        INNER JOIN batch b ON s.batch_id = b.id
        INNER JOIN semester sem ON s.semester_id = sem.id
        INNER JOIN course c ON sem.course_id = c.id
        WHERE m.id = @Id";

        var result = await _dbConnection.QuerySingleOrDefaultAsync<MaterialListResponse>(query, new { Id = id });

        return result!;
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
