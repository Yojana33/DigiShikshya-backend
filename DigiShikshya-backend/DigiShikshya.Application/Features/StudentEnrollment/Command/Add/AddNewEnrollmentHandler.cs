using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;

public class AddNewEnrollmentHandler : IRequestHandler<AddNewEnrollment, AddNewEnrollmentResponse>
{
    private readonly IStudentEnrollmentRepository _studentEnrollmentRepository;

    public AddNewEnrollmentHandler(IStudentEnrollmentRepository studentEnrollmentRepository)
    {
        _studentEnrollmentRepository = studentEnrollmentRepository;
    }

    public async Task<AddNewEnrollmentResponse> Handle(AddNewEnrollment request, CancellationToken cancellationToken)
    {
        // Validate the request
        var validator = new AddNewEnrollmentValidator();
        var validationResult = validator.Validate(request);

        if (!validationResult.IsValid)
        {
            return new AddNewEnrollmentResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList()
            };
        }

        // Map request to StudentEnrollment entity
        var studentEnrollment = new StudentEnrollment
        {
            StudentId = request.StudentId,
            BatchId = request.BatchId,
            SemesterId = request.SemesterId,
            EnrolledDate = request.EnrolledDate
        };

        // Add the new enrollment to the repository
        var success = await _studentEnrollmentRepository.AddStudentEnrollment(studentEnrollment);

        // Return the response based on success or failure
        return new AddNewEnrollmentResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Student enrolled successfully" : "Failed to enroll student",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later" }
        };
    }
}
