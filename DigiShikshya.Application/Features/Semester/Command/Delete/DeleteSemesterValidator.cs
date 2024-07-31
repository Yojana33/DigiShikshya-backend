using FluentValidation;

class DeleteSemesterValidator : AbstractValidator<DeleteSemester>
{
    public DeleteSemesterValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Semester ID is required.").WithErrorCode("400").Must(id => id != Guid.Empty).WithMessage("Semester ID must be a valid GUID.").WithErrorCode("400");
    }
}
