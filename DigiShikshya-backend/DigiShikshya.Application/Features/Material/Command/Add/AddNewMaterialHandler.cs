using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;

public class AddNewMaterialHandler : IRequestHandler<AddNewMaterial, AddNewMaterialResponse>
{
    private readonly IMaterialRepository _materialRepository;

    public AddNewMaterialHandler(IMaterialRepository materialRepository)
    {
        _materialRepository = materialRepository;
    }

    public async Task<AddNewMaterialResponse> Handle(AddNewMaterial request, CancellationToken cancellationToken)
    {
        

        var validator = new AddNewMaterialValidator();
        var validationResult = validator.Validate(request);

        if (!validationResult.IsValid)
        {
            return new AddNewMaterialResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList()
            };
        }

        var material = new Material
        {
            SubjectId = request.SubjectId,
            Title = request.Title,
            Description = request.Description,
            ContentType = request.ContentType,
            Content = request.Content,
            UploadedBy = request.UploadedBy,
            UploadDate = DateTime.UtcNow 
        };

        var success = await _materialRepository.AddMaterial(material);

        return new AddNewMaterialResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Material added successfully" : "Failed to add material",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later" }
        };
    }
}
