using FluentValidation;

public class UpdateSubjectValidator : AbstractValidator<UpdateSubject>
{
    public UpdateSubjectValidator()
    {
        RuleFor(x => x.NewSubjectName)
            .NotEmpty().WithMessage("Subject name is required").WithErrorCode("400");

        RuleFor(x => x.NewSubjectCode)
            .NotEmpty().WithMessage("Subject code is required").WithErrorCode("400");

        RuleFor(x => x.NewCreditHour)
            .NotEmpty().WithMessage("Credit hour is required").WithErrorCode("400")
            .GreaterThan(0).WithMessage("Credit hour must be greater than zero").WithErrorCode("400");

        RuleFor(x => x.NewSemesterId)
            .NotEmpty().WithMessage("Course semester ID is required").WithErrorCode("400");

        RuleFor(x => x.NewBatchId)
            .NotEmpty().WithMessage("Course batch ID is required").WithErrorCode("400");
    }
}
