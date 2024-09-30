using FluentValidation;

public class AddNewTeacherAssignValidator : AbstractValidator<AddNewTeacherAssign>
{
    public AddNewTeacherAssignValidator()
    {
        RuleFor(x => x.TeacherId)
            .NotEmpty().WithMessage("Teacher ID is required").WithErrorCode("400");

        RuleFor(x => x.SubjectId)
            .NotEmpty().WithMessage("Subject ID is required").WithErrorCode("400");
    }
}
