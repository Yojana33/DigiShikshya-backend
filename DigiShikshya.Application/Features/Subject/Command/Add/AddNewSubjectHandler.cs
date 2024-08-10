using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;

public class AddNewSubjectHandler : IRequestHandler<AddNewSubject, AddNewSubjectResponse>
{
    private readonly ISubjectRepository _subjectRepository;

    public AddNewSubjectHandler(ISubjectRepository subjectRepository)
    {
        _subjectRepository = subjectRepository;
    }

    public async Task<AddNewSubjectResponse> Handle(AddNewSubject request, CancellationToken cancellationToken)
    {
        var subjectExists = await _subjectRepository.SubjectAlreadyExists(request.SubjectName!);
        if (subjectExists)
        {
            return new AddNewSubjectResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = new List<string> { "This subject already exists." }
            };
        }

        var validator = new AddNewSubjectValidator();
        var validationResult = validator.Validate(request);

        if (!validationResult.IsValid)
        {
            return new AddNewSubjectResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList()
            };
        }

        var subject = new Subject
        {
            SubjectName = request.SubjectName,
            SubjectCode = request.SubjectCode,
            SubjectDescription = request.SubjectDescription,
            CreditHour = request.CreditHour,
            CourseSemesterId = request.CourseSemesterId,
        };

        var success = await _subjectRepository.AddSubject(subject);

        return new AddNewSubjectResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Subject added successfully" : "Failed to add subject",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later" }
        };
    }
}
