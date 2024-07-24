using FluentValidation;

class AddNewCourseValidator:AbstractValidator<AddNewCourse>
{
    public AddNewCourseValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required").WithErrorCode("400");
    }
    
}