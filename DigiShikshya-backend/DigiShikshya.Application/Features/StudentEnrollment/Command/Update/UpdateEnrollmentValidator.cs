using FluentValidation;

public class UpdateEnrollmentValidator : AbstractValidator<UpdateEnrollment>
{
    public UpdateEnrollmentValidator()
    {
        RuleFor(x => x.NewStudentId)
            .NotEmpty().WithMessage("Student ID is required").WithErrorCode("400");

        RuleFor(x => x.NewBatchId)
            .NotEmpty().WithMessage("Batch ID is required").WithErrorCode("400");

        RuleFor(x => x.NewSemesterId)
            .NotEmpty().WithMessage("Semester ID is required").WithErrorCode("400");

        // RuleFor(x => x.NewEnrolledDate)
        //     .NotEmpty().WithMessage("Enrolled date is required").WithErrorCode("400");
    }
}
