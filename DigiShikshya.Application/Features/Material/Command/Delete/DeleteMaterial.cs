using MediatR;

public class DeleteMaterial : IRequest<DeleteMaterialResponse>
{
    public required Guid Id { get; set; }
}
