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
            response.Message = validationResult.Errors.Select(x => x.ErrorMessage).ToList();
            response.IsSuccess = false;
            return response;
        }

        var existingSemester = await _semesterRepository.GetSemesterById(request.Id);
        if (existingSemester == null)
        {
            response.IsSuccess = false;
            response.Message = new List<string> { "Semester not found" };
            return response;
        }
         
        existingSemester.SemesterName = request.NewName ?? existingSemester.SemesterName;
        existingSemester.StartDate = request.NewStartDate ?? existingSemester.StartDate;
        existingSemester.EndDate = request.NewEndDate ?? existingSemester.EndDate;
        existingSemester.UpdatedAt = DateTime.Now;

        var success = await _semesterRepository.UpdateSemester(existingSemester);
        response.IsSuccess = success;
        response.Message = success ? new List<string> { "Semester updated successfully" } : new List<string> { "Failed to update semester" };

        return response;
    }
}
