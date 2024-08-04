using MediatR;
using System.Threading;
using System.Threading.Tasks;

public class DeleteSemesterHandler(ISemesterRepository _semesterRepository) : IRequestHandler<DeleteSemester, DeleteSemesterResponse>
{
    public async Task<DeleteSemesterResponse> Handle(DeleteSemester request, CancellationToken cancellationToken)
    {
       // var response = new DeleteSemesterResponse();
        var course = await _semesterRepository.GetSemesterById(request.Id);
        if (course == null)
        {
            return new DeleteSemesterResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = new List<string> { "Semester not found." }
            };
        }

        var validator = new DeleteSemesterValidator();
        var validationResult = validator.Validate(request);
        if (!validationResult.IsValid)
        {
            return new DeleteSemesterResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList()
            };
        }

        var success = await _semesterRepository.DeleteSemester(request.Id);
        return new DeleteSemesterResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Semester deleted successfully." : "Failed to delete course.",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later." }
        };
    }

}
