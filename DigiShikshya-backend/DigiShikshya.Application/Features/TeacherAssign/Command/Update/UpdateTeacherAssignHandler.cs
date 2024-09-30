using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

public class UpdateTeacherAssignHandler(ITeacherAssignRepository _teacherAssignRepository) : IRequestHandler<UpdateTeacherAssign, UpdateTeacherAssignResponse>
{
    public async Task<UpdateTeacherAssignResponse> Handle(UpdateTeacherAssign request, CancellationToken cancellationToken)
    {
        var response = new UpdateTeacherAssignResponse();
        var validator = new UpdateTeacherAssignValidator();
        var validationResult = validator.Validate(request);

        if (!validationResult.IsValid)
        {
            response.Status = "Bad Request";
            response.Message = "Validation failed";
            response.Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList();
            return response;

        }

        // Retrieve the existing teacher assignment
        var existingAssignment = await _teacherAssignRepository.GetTeacherAssignmentById(request.Id);
        if (existingAssignment == null)
        {
            return new UpdateTeacherAssignResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = new List<string> { "Teacher assignment could not be found." }
            };
        }

        // Update the existing teacher assignment with new values
        existingAssignment.TeacherId = request.NewTeacherId != Guid.Empty ? request.NewTeacherId : existingAssignment.TeacherId;
        existingAssignment.SubjectId = request.NewSubjectId != Guid.Empty ? request.NewSubjectId : existingAssignment.SubjectId;
        existingAssignment.UpdatedAt = DateTime.Now;

        // Update the assignment in the repository
        var success = await _teacherAssignRepository.UpdateTeacherAssignment(existingAssignment);

        return new UpdateTeacherAssignResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Teacher assignment updated successfully." : "Failed to update teacher assignment.",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later." }
        };
    }
}
