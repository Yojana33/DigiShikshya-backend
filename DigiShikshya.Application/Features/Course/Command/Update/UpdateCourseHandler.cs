using MediatR;

public class UpdateCourseHandler(ICourseRepository _courseRepository) : IRequestHandler<UpdateCourse, UpdateCourseResponse>
{
    public async Task<UpdateCourseResponse> Handle(UpdateCourse request, CancellationToken cancellationToken)
    {
        var response = new UpdateCourseResponse();
        var validator = new UpdateCourseValidator();
        var validationResult = validator.Validate(request);

        if (!validationResult.IsValid)
        {

            response.Status = "Bad Request";
            response.Message = "Validation failed";
            response.Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList();
            return response;
        }

        var updateCourse = new Course
        {
            Id = request.Id,
            CourseName = request.NewName,
            CourseDescription = request.NewDescription
        };

        var success = await _courseRepository.UpdateCourse(updateCourse);
        return new UpdateCourseResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Course updated successfully" : "Failed to update course",
            Errors = success ? [""] : ["Something went wrong, please try again later"]
        };
    }
}
