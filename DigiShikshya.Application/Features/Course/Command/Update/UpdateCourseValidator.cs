using FluentValidation;

class UpdateCourseValidator : AbstractValidator<UpdateCourse>
{
    public UpdateCourseValidator()
    {
       RuleFor(x => x.NewName).NotEmpty().WithMessage("Name is required").WithErrorCode("400");
    }

}