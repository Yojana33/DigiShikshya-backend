using FluentValidation;

class DeleteMaterialValidator : AbstractValidator<DeleteMaterial>
{
    public DeleteMaterialValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Material ID is required.").WithErrorCode("400")
            .Must(id => id != Guid.Empty).WithMessage("Material ID must be a valid GUID.").WithErrorCode("400");
    }
}