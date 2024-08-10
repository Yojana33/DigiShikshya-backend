using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class UpdateSubjectHandler(ISubjectRepository _subjectRepository) : IRequestHandler<UpdateSubject, UpdateSubjectResponse>
{
    public async Task<UpdateSubjectResponse> Handle(UpdateSubject request, CancellationToken cancellationToken)
    {
        var response = new UpdateSubjectResponse();
        var validator = new UpdateSubjectValidator();
        var validationResult = validator.Validate(request);

        if (!validationResult.IsValid)
        {
            response.IsSuccess = false;
            response.Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList();
            return response;
        }

        // Retrieve the existing subject as a SubjectListResponse
        var existingSubjectResponse = await _subjectRepository.GetSubjectById(request.Id);
        if (existingSubjectResponse == null)
        {
            return new UpdateSubjectResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = new List<string> { "Subject could not be found." }
            };
        }

        // Check if the new subject name already exists
        if (request.NewSubjectName != null && request.NewSubjectName != existingSubjectResponse.SubjectName)
        {
            var subjectExists = await _subjectRepository.SubjectAlreadyExists(request.NewSubjectName);
            if (subjectExists)
            {
                return new UpdateSubjectResponse
                {
                    Status = "Bad Request",
                    Message = "Validation failed",
                    Errors = new List<string> { "This subject already exists." }
                };
            }
        }

        // Convert SubjectListResponse to Subject entity
        var existingSubject = new Subject
        {
            Id = existingSubjectResponse.Id,
            CourseSemesterId = existingSubjectResponse.CourseSemesterId,
            SubjectName = existingSubjectResponse.SubjectName,
            SubjectCode = existingSubjectResponse.SubjectCode,
            SubjectDescription = existingSubjectResponse.SubjectDescription,
            CreditHour = existingSubjectResponse.CreditHour,
            CreatedAt = existingSubjectResponse.CreatedAt,
            UpdatedAt = DateTime.Now
        };

        // Apply updates to the existingSubject entity
        existingSubject.CourseSemesterId = request.NewCourseSemesterId != Guid.Empty ? request.NewCourseSemesterId : existingSubject.CourseSemesterId;
        existingSubject.SubjectName = request.NewSubjectName ?? existingSubject.SubjectName;
        existingSubject.SubjectCode = request.NewSubjectCode ?? existingSubject.SubjectCode;
        existingSubject.SubjectDescription = request.NewSubjectDescription ?? existingSubject.SubjectDescription;
        existingSubject.CreditHour = request.NewCreditHour ?? existingSubject.CreditHour;
        existingSubject.UpdatedAt = DateTime.Now;

        // Update the subject in the repository
        var success = await _subjectRepository.UpdateSubject(existingSubject);

        return new UpdateSubjectResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Subject updated successfully" : "Failed to update subject",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later" }
        };
    }
}
