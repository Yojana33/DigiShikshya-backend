using FluentValidation;

public class UpdateAssignmentValidator : AbstractValidator<UpdateAssignment>
{
    public UpdateAssignmentValidator()
    {
        RuleFor(x => x.NewTitle)
            .NotEmpty().WithMessage("Title is required").WithErrorCode("400");

        RuleFor(x => x.NewDescription)
            .NotEmpty().WithMessage("Description is required").WithErrorCode("400");

        RuleFor(x => x.NewDueDate)
            .NotEmpty().WithMessage("Due date is required").WithErrorCode("400")
            .GreaterThan(DateTime.Now).WithMessage("Due date must be in the future").WithErrorCode("400");

        RuleFor(x => x.NewSubjectId)
            .NotEmpty().WithMessage("Subject ID is required").WithErrorCode("400");
    }
}
