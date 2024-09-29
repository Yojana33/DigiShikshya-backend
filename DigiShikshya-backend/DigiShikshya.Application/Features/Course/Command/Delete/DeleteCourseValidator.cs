using FluentValidation;

class DeleteCourseValidator : AbstractValidator<DeleteCourse>
{
    public DeleteCourseValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Course ID is required.").WithErrorCode("400").Must(id => id != Guid.Empty).WithMessage("Course ID must be a valid GUID.") .WithErrorCode("400");
    }
}
