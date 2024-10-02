using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

public class DeleteEnrollmentHandler : IRequestHandler<DeleteEnrollment, DeleteEnrollmentResponse>
{
    private readonly IStudentEnrollmentRepository _studentEnrollmentRepository;

    public DeleteEnrollmentHandler(IStudentEnrollmentRepository studentEnrollmentRepository)
    {
        _studentEnrollmentRepository = studentEnrollmentRepository;
    }

    public async Task<DeleteEnrollmentResponse> Handle(DeleteEnrollment request, CancellationToken cancellationToken)
    {
        // Check if the enrollment exists
        var enrollment = await _studentEnrollmentRepository.GetStudentEnrollmentById(request.Id);
        if (enrollment == null)
        {
            return new DeleteEnrollmentResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = new List<string> { "Enrollment not found." }
            };
        }

        // Validate the request
        var validator = new DeleteEnrollmentValidator();
        var validationResult = validator.Validate(request);
        if (!validationResult.IsValid)
        {
            return new DeleteEnrollmentResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList()
            };
        }

        // Attempt to delete the enrollment
        var success = await _studentEnrollmentRepository.DeleteStudentEnrollment(request.Id);
        return new DeleteEnrollmentResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Enrollment deleted successfully." : "Failed to delete enrollment.",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later." }
        };
    }
}
