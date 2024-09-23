using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class MaterialListHandler(IMaterialRepository _materialRepository) : IRequestHandler<MaterialListQuery, PaginatedResult<MaterialListResponse>>
{
    public async Task<PaginatedResult<MaterialListResponse>> Handle(MaterialListQuery request, CancellationToken cancellationToken)
    {
        var materials = await _materialRepository.GetAllMaterials(request);

        var response = new PaginatedResult<MaterialListResponse>
        {
            Items = materials?.Items?.Select(x => new MaterialListResponse
            {
                Id = x.Id,
                SubjectId = x.SubjectId,
                Title = x.Title,
                Description = x.Description,
                ContentType = x.ContentType,
                Content = x.Content,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt,
                CreatedBy = x.CreatedBy,
                UpdatedBy = x.UpdatedBy,
                IsActive = x.IsActive
            }).ToList(),
            Page = materials!.Page,
            PageSize = materials.PageSize,
            TotalCount = materials.TotalCount,
            TotalPages = materials.TotalPages
        };

        return response;
    }
}