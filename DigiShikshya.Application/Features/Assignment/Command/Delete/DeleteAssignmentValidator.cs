using FluentValidation;

class DeleteAssignmentValidator : AbstractValidator<DeleteAssignment>
{
    public DeleteAssignmentValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Assignment ID is required.").WithErrorCode("400").Must(id => id != Guid.Empty).WithMessage("Assignment ID must be a valid GUID.").WithErrorCode("400");
    }
}
