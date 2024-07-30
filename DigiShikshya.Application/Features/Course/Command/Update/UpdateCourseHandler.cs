using MediatR;

public class UpdateCourseHandler(ICourseRepository _courseRepository) : IRequestHandler<UpdateCourse, UpdateCourseResponse>
{
    public async Task<UpdateCourseResponse> Handle(UpdateCourse request, CancellationToken cancellationToken)
    {
        var response = new UpdateCourseResponse();
        var validator = new UpdateCourseValidator();
        var validationResult = validator.Validate(request);

        if (validationResult.IsValid)
        {
            var course = new Course
            {
                CourseName = request.NewName,
                CourseDescription = request.NewDescription
            };

            var success = await _courseRepository.UpdateCourse(course);
            response.IsSuccess = success;
            response.Message = success ? ["Course updated successfully"] : ["Failed to update course"];
            return response;
        }
        else
        {
            response.Message = validator.Validate(request).Errors.Select(x => x.ErrorMessage).ToList();
            response.IsSuccess = false;
            return response;

        }
    }
}