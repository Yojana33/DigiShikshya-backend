using FluentValidation;

public class DeleteEnrollmentValidator : AbstractValidator<DeleteEnrollment>
{
    public DeleteEnrollmentValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Enrollment ID is required.").WithErrorCode("400")
            .Must(id => id != Guid.Empty).WithMessage("Enrollment ID must be a valid GUID.").WithErrorCode("400");
    }
}
