using FluentValidation;

public class AddNewBatchValidator : AbstractValidator<AddNewBatch>
{
    public AddNewBatchValidator()
    {
        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("Start date is required").WithErrorCode("400")
            .LessThan(x => x.EndDate).WithMessage("Start date must be before the end date").WithErrorCode("400");

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage("End date is required").WithErrorCode("400");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid status value").WithErrorCode("400");
    }
}
