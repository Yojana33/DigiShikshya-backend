using FluentValidation;

class DeleteSubjectValidator : AbstractValidator<DeleteSubject>
{
    public DeleteSubjectValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Subject ID is required.").WithErrorCode("400")
            .Must(id => id != Guid.Empty).WithMessage("Subject ID must be a valid GUID.").WithErrorCode("400");
    }
}
