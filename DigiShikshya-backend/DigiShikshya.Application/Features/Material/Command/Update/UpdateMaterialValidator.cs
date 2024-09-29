using FluentValidation;

public class UpdateMaterialValidator : AbstractValidator<UpdateMaterial>
{
    public UpdateMaterialValidator()
    {
        RuleFor(x => x.NewTitle)
            .NotEmpty().WithMessage("Title is required").WithErrorCode("400");

        RuleFor(x => x.NewDescription)
            .NotEmpty().WithMessage("Description is required").WithErrorCode("400");

        RuleFor(x => x.NewContentType)
            .NotEmpty().WithMessage("Content type is required").WithErrorCode("400");

        RuleFor(x => x.NewContent)
            .NotEmpty().WithMessage("Content is required").WithErrorCode("400");

        RuleFor(x => x.NewSubjectId)
            .NotEmpty().WithMessage("Subject ID is required").WithErrorCode("400");

        RuleFor(x => x.NewUploadedBy)
            .NotEmpty().WithMessage("Uploaded by is required").WithErrorCode("400");
    }
}