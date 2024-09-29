using FluentValidation;

public class AddNewSemesterValidator : AbstractValidator<AddNewSemester>
{
    public AddNewSemesterValidator()
    {
        RuleFor(x => x.SemesterName)
            .NotEmpty().WithMessage("Semester name is required").WithErrorCode("400");

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("Start date is required").WithErrorCode("400")
            .LessThan(x => x.EndDate).WithMessage("Start date must be before the end date").WithErrorCode("400");

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage("End date is required").WithErrorCode("400");

    }
}
