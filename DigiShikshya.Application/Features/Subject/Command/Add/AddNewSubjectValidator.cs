using FluentValidation;

public class AddNewSubjectValidator : AbstractValidator<AddNewSubject>
{
    public AddNewSubjectValidator()
    {
        RuleFor(x => x.SubjectName)
        .NotEmpty().WithMessage("Semester name is required").WithErrorCode("400");
        
        RuleFor(x => x.SubjectCode)
        .NotEmpty().WithMessage("Subject code is required").WithErrorCode("400");

        RuleFor(x => x.CreditHour)
        .NotEmpty().WithMessage("Credit hours is required").WithErrorCode("400")
        .GreaterThan(0).WithMessage("Credit hours must be greater than 0").WithErrorCode("400");

        RuleFor(x => x.SubjectDescription)
        .NotEmpty().WithMessage("Description is required").WithErrorCode("400")
        .MaximumLength(100).WithMessage("Description must not exceed 100 characters").WithErrorCode("400");


    }
}