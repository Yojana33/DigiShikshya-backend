using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using MediatR;
using Microsoft.AspNetCore.Http;

public class AddNewSubmissionHandler(ISubmissionRepository submissionRepository, IAssignmentRepository assignmentRepository) : IRequestHandler<AddNewSubmission, AddNewSubmissionResponse>
{
    private readonly ISubmissionRepository _submissionRepository = submissionRepository;
    private readonly IAssignmentRepository _assignmentRepository = assignmentRepository;

    public async Task<AddNewSubmissionResponse> Handle(AddNewSubmission request, CancellationToken cancellationToken)
    {
        // Validate the request
        var validator = new AddNewSubmissionValidator();
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            return new AddNewSubmissionResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList()
            };
        }

        // Check if the assignment exists and retrieve its details
        var assignment = await _assignmentRepository.GetAssignmentById(request.AssignmentId);
        if (assignment == null)
        {
            return new AddNewSubmissionResponse
            {
                Status = "Not Found",
                Message = "Assignment not found",
                Errors = new List<string> { "The specified assignment does not exist." }
            };
        }

        // Check if the submission is made after the due date
        if (DateTime.UtcNow > assignment.DueDate)
        {
            return new AddNewSubmissionResponse
            {
                Status = "Bad Request",
                Message = "Submission cannot be made after the due date.",
                Errors = new List<string> { "The due date for this assignment has passed." }
            };
        }

        // Create a new submission object
        var submission = new Submission
        {
            AssignmentId = request.AssignmentId,
            StudentId = request.StudentId,
            SubmittedFile = await ConvertToByteArray(request.SubmittedFile!)
            // No need to set SubmittedDate; it will be handled by the database
        };

        // Add the submission to the repository
        var success = await _submissionRepository.AddSubmission(submission);

        return new AddNewSubmissionResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Submission added successfully" : "Failed to add submission",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later" }
        };
    }
    private async Task<byte[]> ConvertToByteArray(IFormFile content)
    {
        using var memoryStream = new MemoryStream();
        await content.CopyToAsync(memoryStream);
        return memoryStream.ToArray();
    }
}