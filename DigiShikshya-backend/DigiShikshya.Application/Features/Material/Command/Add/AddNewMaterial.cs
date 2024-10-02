using MediatR;
using Microsoft.AspNetCore.Http;

public class AddNewMaterial : IRequest<AddNewMaterialResponse>
{
    public Guid SubjectId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? ContentType { get; set; }
    public IFormFile? Content { get; set; }
    public string? UploadedBy { get; set; }
}
