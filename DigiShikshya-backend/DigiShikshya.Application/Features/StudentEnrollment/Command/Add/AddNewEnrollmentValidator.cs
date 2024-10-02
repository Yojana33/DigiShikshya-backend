using FluentValidation;

public class AddNewEnrollmentValidator : AbstractValidator<AddNewEnrollment>
{
    public AddNewEnrollmentValidator()
    {
        RuleFor(x => x.StudentId)
            .NotEmpty().WithMessage("Student ID is required").WithErrorCode("400");

        RuleFor(x => x.BatchId)
            .NotEmpty().WithMessage("Batch ID is required").WithErrorCode("400");

        RuleFor(x => x.SemesterId)
            .NotEmpty().WithMessage("Semester ID is required").WithErrorCode("400");

        RuleFor(x => x.EnrolledDate)
            .NotEmpty().WithMessage("Enrolled date is required").WithErrorCode("400");
    }
}
