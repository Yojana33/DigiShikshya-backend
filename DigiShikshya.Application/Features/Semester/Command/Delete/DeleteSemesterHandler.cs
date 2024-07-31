using MediatR;
using System.Threading;
using System.Threading.Tasks;

public class DeleteSemesterHandler(ISemesterRepository _semesterRepository) : IRequestHandler<DeleteSemester, DeleteSemesterResponse>
{
    public async Task<DeleteSemesterResponse> Handle(DeleteSemester request, CancellationToken cancellationToken)
    {
        var response = new DeleteSemesterResponse();
        var validator = new DeleteSemesterValidator();
        var validationResult = validator.Validate(request);

        if (validationResult.IsValid)
        {
            var success = await _semesterRepository.DeleteSemester(request.Id);
            response.IsSuccess = success;
            response.Message = success ? new List<string> { "Semester deleted successfully" } : new List<string> { "Failed to delete semester" };
        }
        else
        {
            response.IsSuccess = false;
            response.Message = validationResult.Errors.Select(x => x.ErrorMessage).ToList();
        }

        return response;
    }
}
