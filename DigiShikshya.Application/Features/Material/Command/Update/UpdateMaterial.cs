using MediatR;
using System;

public class UpdateMaterial : IRequest<UpdateMaterialResponse>
{
    public required Guid Id { get; set; }
    public Guid NewSubjectId { get; set; }
    public string? NewTitle { get; set; }
    public string? NewDescription { get; set; }
    public string? NewContentType { get; set; }
    public byte[]? NewContent { get; set; }
    public string? NewUploadedBy { get; set; }
}