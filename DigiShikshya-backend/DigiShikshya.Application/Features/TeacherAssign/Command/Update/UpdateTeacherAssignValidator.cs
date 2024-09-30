using FluentValidation;

public class UpdateTeacherAssignValidator : AbstractValidator<UpdateTeacherAssign>
{
    public UpdateTeacherAssignValidator()
    {
        RuleFor(x => x.NewTeacherId)
            .NotEmpty().WithMessage("Teacher ID is required").WithErrorCode("400");

        RuleFor(x => x.NewSubjectId)
            .NotEmpty().WithMessage("Subject ID is required").WithErrorCode("400");
    }
}