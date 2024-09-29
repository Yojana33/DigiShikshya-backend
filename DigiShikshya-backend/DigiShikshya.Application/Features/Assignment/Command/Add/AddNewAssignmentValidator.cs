using FluentValidation;

public class AddNewAssignmentValidator : AbstractValidator<AddNewAssignment>
{
    public AddNewAssignmentValidator()
    {
        RuleFor(x => x.SubjectId)
            .NotEmpty().WithMessage("Subject is required").WithErrorCode("400");

        RuleFor(x => x.TeacherId)
            .NotEmpty().WithMessage("Teacher is required").WithErrorCode("400");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required").WithErrorCode("400")
            .MaximumLength(255).WithMessage("Title must not exceed 255 characters").WithErrorCode("400");

        RuleFor(x => x.DueDate)
            .GreaterThan(DateTime.Now).WithMessage("Due date must be in the future").WithErrorCode("400");

        RuleFor(x => x.UploadedBy)
            .NotEmpty().WithMessage("Uploaded by is required").WithErrorCode("400");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters").WithErrorCode("400");
    }
}
