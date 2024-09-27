using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

public class UpdateAssignmentHandler(IAssignmentRepository _assignmentRepository) : IRequestHandler<UpdateAssignment, UpdateAssignmentResponse>
{
    public async Task<UpdateAssignmentResponse> Handle(UpdateAssignment request, CancellationToken cancellationToken)
    {
        var response = new UpdateAssignmentResponse();
        var validator = new UpdateAssignmentValidator();
        var validationResult = validator.Validate(request);

        if (!validationResult.IsValid)
        {
            response.IsSuccess = false;
            response.Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList();
            return response;
        }

        // Retrieve the existing assignment
        var existingAssignment = await _assignmentRepository.GetAssignmentById(request.Id);
        if (existingAssignment == null)
        {
            return new UpdateAssignmentResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = new List<string> { "Assignment could not be found." }
            };
        }

        // // Check if the new title is provided and validate uniqueness if necessary
        // if (request.NewTitle != null && request.NewTitle != existingAssignment.Title)
        // {
        //     var titleExists = await assignmentRepository.TitleAlreadyExists(request.NewTitle);
        //     if (titleExists)
        //     {
        //         return new UpdateAssignmentResponse
        //         {
        //             Status = "Bad Request",
        //             Message = "Validation failed",
        //             Errors = new List<string> { "This assignment title already exists." }
        //         };
        //     }
        // }

        // Update the existing assignment with new values
        existingAssignment.SubjectId = request.NewSubjectId != Guid.Empty ? request.NewSubjectId : existingAssignment.SubjectId;
        existingAssignment.Title = request.NewTitle ?? existingAssignment.Title;
        existingAssignment.Description = request.NewDescription ?? existingAssignment.Description;
        existingAssignment.DueDate = request.NewDueDate != default ? request.NewDueDate : existingAssignment.DueDate;
        existingAssignment.UpdatedAt = DateTime.Now;

        // Update the assignment in the repository
        var success = await _assignmentRepository.UpdateAssignment(existingAssignment);

        return new UpdateAssignmentResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Assignment updated successfully." : "Failed to update assignment.",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later." }
        };
    }
}
