using FluentValidation;

class AddNewCourseValidator:AbstractValidator<AddNewCourse>
{
    public AddNewCourseValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required").WithErrorCode("400");
        RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required").WithErrorCode("400");
    }
    
}