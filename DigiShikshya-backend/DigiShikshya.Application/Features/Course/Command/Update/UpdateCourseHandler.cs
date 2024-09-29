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

        var existingCourse = await _courseRepository.GetCourseById(request.Id);
        if (existingCourse == null)
        {
            response.Status = "Bad Request";
            response.Message = "Validation failed";
            response.Errors = new List<string> { "Course not found." };
            return response;
        }

        if (request.NewName != existingCourse.CourseName)
        {
            var courseExists = await _courseRepository.CourseNameExists(request.NewName!);
            if (courseExists)
            {
                return new UpdateCourseResponse
                {
                    Status = "Bad Request",
                    Message = "Validation failed",
                    Errors = new List<string> { "A course with this name already exists." }
                };
            }
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
