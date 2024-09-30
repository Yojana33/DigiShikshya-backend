using FluentValidation;

class DeleteTeacherAssignValidator : AbstractValidator<DeleteTeacherAssign>
{
    public DeleteTeacherAssignValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Teacher Assign ID is required.").WithErrorCode("400").Must(id => id != Guid.Empty).WithMessage("Teacher Assign ID must be a valid GUID.").WithErrorCode("400");
    }
}
