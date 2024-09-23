using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

public class DeleteMaterialHandler(IMaterialRepository _materialRepository) : IRequestHandler<DeleteMaterial, DeleteMaterialResponse>
{
    public async Task<DeleteMaterialResponse> Handle(DeleteMaterial request, CancellationToken cancellationToken)
    {
        // Check if the material exists
        var material = await _materialRepository.GetMaterialById(request.Id);
        if (material == null)
        {
            return new DeleteMaterialResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = new List<string> { "Material not found." }
            };
        }

        // Validate the request
        var validator = new DeleteMaterialValidator();
        var validationResult = validator.Validate(request);
        if (!validationResult.IsValid)
        {
            return new DeleteMaterialResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList()
            };
        }

        // Attempt to delete the material
        var success = await _materialRepository.DeleteMaterial(request.Id);
        return new DeleteMaterialResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Material deleted successfully." : "Failed to delete material.",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later." }
        };
    }
}