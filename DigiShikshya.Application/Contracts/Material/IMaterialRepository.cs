public interface IMaterialRepository
{
    Task<PaginatedResult<Material>> GetAllMaterials(MaterialListQuery request);
    Task<Material> GetMaterialById(Guid id);
    Task<bool> AddMaterial(Material material);
    Task<bool> UpdateMaterial(Material material);
    Task<bool> DeleteMaterial(Guid id);
    Task<byte[]> GetVideoContentById(Guid id);
}
