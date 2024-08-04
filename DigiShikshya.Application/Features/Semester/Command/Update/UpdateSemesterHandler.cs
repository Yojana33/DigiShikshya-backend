using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class UpdateSemesterHandler : IRequestHandler<UpdateSemester, UpdateSemesterResponse>
{
    private readonly ISemesterRepository _semesterRepository;

    public UpdateSemesterHandler(ISemesterRepository semesterRepository)
    {
        _semesterRepository = semesterRepository;
    }

    public async Task<UpdateSemesterResponse> Handle(UpdateSemester request, CancellationToken cancellationToken)
    {
        var response = new UpdateSemesterResponse();
        var validator = new UpdateSemesterValidator();
        var validationResult = validator.Validate(request);

        if (!validationResult.IsValid)
        {
            // response.Message = validationResult.Errors.Select(x => x.ErrorMessage).ToList();
            response.IsSuccess = false;
            return response;
        }

        var existingSemester = await _semesterRepository.GetSemesterById(request.Id);
        if (existingSemester == null)
        {
            return new UpdateSemesterResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = new List<string> { "Semester could not be found." }
            };
        }

        if (request.NewName != existingSemester.SemesterName)
        {
            var semesterExists = await _semesterRepository.SemesterAlreadyExists(request.NewName!);
            if (semesterExists)
            {
                return new UpdateSemesterResponse
                {
                    Status = "Bad Request",
                    Message = "Validation failed",
                    Errors = new List<string> { "This semester already exists." }
                };
            }
        }



        existingSemester.SemesterName = request.NewName ?? existingSemester.SemesterName;
        existingSemester.StartDate = request.NewStartDate ?? existingSemester.StartDate;
        existingSemester.EndDate = request.NewEndDate ?? existingSemester.EndDate;
        existingSemester.UpdatedAt = DateTime.Now;

        var success = await _semesterRepository.UpdateSemester(existingSemester);
        return new UpdateSemesterResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Semester updated successfully" : "Failed to update semester",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later" }
        };

    }
}
