using FluentValidation;

public class AddNewSubmissionValidator : AbstractValidator<AddNewSubmission>
{
    public AddNewSubmissionValidator()
    {
        RuleFor(x => x.AssignmentId)
            .NotEmpty().WithMessage("Assignment ID is required").WithErrorCode("400");

        RuleFor(x => x.StudentId)
            .NotEmpty().WithMessage("Student ID is required").WithErrorCode("400");

        RuleFor(x => x.SubmittedFile)
            .NotNull().WithMessage("Submitted file is required").WithErrorCode("400")
            .NotEmpty().WithMessage("Submitted file cannot be empty").WithErrorCode("400");

    }
}
