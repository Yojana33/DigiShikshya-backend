using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class DeleteCourseHandler : IRequestHandler<DeleteCourse, DeleteCourseResponse>
{
    private readonly ICourseRepository _courseRepository;

    public DeleteCourseHandler(ICourseRepository courseRepository)
    {
        _courseRepository = courseRepository;
    }

    public async Task<DeleteCourseResponse> Handle(DeleteCourse request, CancellationToken cancellationToken)
    {
        var course = await _courseRepository.GetCourseById(request.Id);
        if (course == null)
        {
            return new DeleteCourseResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = new List<string> { "Course not found." }
            };
        }

        var validator = new DeleteCourseValidator();
        var validationResult = validator.Validate(request);
        if (!validationResult.IsValid)
        {
            return new DeleteCourseResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList()
            };
        }
       
        var success = await _courseRepository.DeleteCourse(request.Id);
        return new DeleteCourseResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Course deleted successfully." : "Failed to delete course.",
            Errors = success ? null : new List<string> { "Something went wrong, please try again later." }
        };
    }
}
