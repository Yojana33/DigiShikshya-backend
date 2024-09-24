public interface IMaterialRepository
{
    Task<PaginatedResult<MaterialListResponse>> GetAllMaterials(MaterialListQuery request);
    Task<MaterialListResponse> GetMaterialById(Guid id);
    Task<bool> AddMaterial(Material material);
    Task<bool> UpdateMaterial(Material material);
    Task<bool> DeleteMaterial(Guid id);
    Task<byte[]> GetVideoContentById(Guid id);
}
