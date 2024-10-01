using FluentValidation;

class UpdateBatchValidator : AbstractValidator<UpdateBatch>
{
    public UpdateBatchValidator()
    {
        RuleFor(x => x.NewStartDate).NotNull().WithMessage("Cannot set null").WithErrorCode("400");
        RuleFor(x => x.NewEndDate).NotEmpty().WithMessage("Cannot set null").WithErrorCode("400");
        RuleFor(x => x.NewStatus).NotEmpty().WithMessage("Description is required").WithErrorCode("400");
    }
}

