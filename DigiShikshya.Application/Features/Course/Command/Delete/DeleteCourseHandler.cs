using MediatR;
using System.Threading;
using System.Threading.Tasks;

public class DeleteCourseHandler(ICourseRepository _courseRepository) : IRequestHandler<DeleteCourse, DeleteCourseResponse>
{
    public async Task<DeleteCourseResponse> Handle(DeleteCourse request, CancellationToken cancellationToken)
    {
        var response = new DeleteCourseResponse();
        var validator = new DeleteCourseValidator();
        var validationResult = validator.Validate(request);

        if (validationResult.IsValid)
        {
            var success = await _courseRepository.DeleteCourse(request.Id);
            response.IsSuccess = success;
            response.Message = success ? new List<string> { "Course deleted successfully" } : new List<string> { "Failed to delete course" };
        }
        else
        {
            response.IsSuccess = false;
            response.Message = validationResult.Errors.Select(x => x.ErrorMessage).ToList();
        }

        return response;
    }
}
