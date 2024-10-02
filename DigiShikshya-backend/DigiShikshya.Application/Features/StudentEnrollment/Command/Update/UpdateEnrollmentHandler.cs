using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

public class UpdateEnrollmentHandler : IRequestHandler<UpdateEnrollment, UpdateEnrollmentResponse>
{
    private readonly IStudentEnrollmentRepository _studentEnrollmentRepository;

    public UpdateEnrollmentHandler(IStudentEnrollmentRepository studentEnrollmentRepository)
    {
        _studentEnrollmentRepository = studentEnrollmentRepository;
    }

    public async Task<UpdateEnrollmentResponse> Handle(UpdateEnrollment request, CancellationToken cancellationToken)
    {
        var response = new UpdateEnrollmentResponse();
        var validator = new UpdateEnrollmentValidator();
        var validationResult = validator.Validate(request);

        if (!validationResult.IsValid)
        {
            response.Status = "Bad Request";
            response.Message = "Validation failed";
            response.Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList();
            return response;
        }

        // Retrieve the existing enrollment
        var existingEnrollment = await _studentEnrollmentRepository.GetStudentEnrollmentById(request.Id);
        if (existingEnrollment == null)
        {
            return new UpdateEnrollmentResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = new List<string> { "Enrollment could not be found." }
            };
        }

        // Update the existing enrollment with new values
        existingEnrollment.StudentId = request.NewStudentId != Guid.Empty ? request.NewStudentId : existingEnrollment.StudentId;
        existingEnrollment.BatchId = request.NewBatchId != Guid.Empty ? request.NewBatchId : existingEnrollment.BatchId;
        existingEnrollment.SemesterId = request.NewSemesterId != Guid.Empty ? request.NewSemesterId : existingEnrollment.SemesterId;
        existingEnrollment.EnrolledDate = request.NewEnrolledDate != default ? request.NewEnrolledDate : existingEnrollment.EnrolledDate;
        existingEnrollment.UpdatedAt = DateTime.Now;

        // Update the enrollment in the repository
        var success = await _studentEnrollmentRepository.UpdateStudentEnrollment(existingEnrollment);

        return new UpdateEnrollmentResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Enrollment updated successfully." : "Failed to update enrollment.",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later." }
        };
    }
}
