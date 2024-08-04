using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;

public class AddNewSemesterHandler(ISemesterRepository _semesterRepository) : IRequestHandler<AddNewSemester, AddNewSemesterResponse>
{

    public async Task<AddNewSemesterResponse> Handle(AddNewSemester request, CancellationToken cancellationToken)
    {
        var semesterExists = await _semesterRepository.SemesterAlreadyExists(request.SemesterName!);
        if (semesterExists)
        {
            return new AddNewSemesterResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = new List<string> { "This semester already exists." }
            };
        }


        var validator = new AddNewSemesterValidator();
        var validationResult = validator.Validate(request);

        if (!validationResult.IsValid)
        {
            return new AddNewSemesterResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList()
            };
        }

        var semester = new Semester
        {
            SemesterName = request.SemesterName,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
        };

        var success = await _semesterRepository.AddSemester(semester);

        return new AddNewSemesterResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Semester added successfully" : "Failed to add semester",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later" }
        };
    }
}
