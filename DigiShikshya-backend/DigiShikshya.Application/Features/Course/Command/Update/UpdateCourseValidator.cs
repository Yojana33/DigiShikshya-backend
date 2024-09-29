using FluentValidation;

class UpdateCourseValidator : AbstractValidator<UpdateCourse>
{
    public UpdateCourseValidator()
    {
        RuleFor(x => x.NewName).NotNull().WithMessage("Cannot set null").WithErrorCode("400");
        RuleFor(x => x.NewDescription).NotEmpty().WithMessage("Description is required").WithErrorCode("400");
    }

}