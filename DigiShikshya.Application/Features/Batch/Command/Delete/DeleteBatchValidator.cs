using FluentValidation;

class DeleteBatchValidator : AbstractValidator<DeleteBatch>
{
    public DeleteBatchValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Batch ID is required.").WithErrorCode("400").Must(id => id != Guid.Empty).WithMessage("Batch ID must be a valid GUID.").WithErrorCode("400");
    }
}
