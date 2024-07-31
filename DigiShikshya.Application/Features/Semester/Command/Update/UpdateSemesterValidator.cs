using FluentValidation;

public class UpdateSemesterValidator : AbstractValidator<UpdateSemester>
{
    public UpdateSemesterValidator()
    {
        RuleFor(x => x.NewName)
            .NotEmpty().WithMessage("Semester name is required").WithErrorCode("400");

        RuleFor(x => x.NewStartDate)
            .NotEmpty().WithMessage("Start date is required").WithErrorCode("400").LessThan(x => x.NewEndDate).WithMessage("Start date must be before the end date").WithErrorCode("400");

        RuleFor(x => x.NewEndDate).NotEmpty().WithMessage("End date is required").WithErrorCode("400");
    }
}
