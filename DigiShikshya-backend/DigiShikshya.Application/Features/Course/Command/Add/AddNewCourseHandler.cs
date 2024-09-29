using MediatR;

public class AddNewCourseHandler(ICourseRepository _courseRepository) : IRequestHandler<AddNewCourse, AddNewCourseResponse>
{
    public async Task<AddNewCourseResponse> Handle(AddNewCourse request, CancellationToken cancellationToken)
    {

        var courseExists = await _courseRepository.CourseNameExists(request.Name!);
        if (courseExists)
        {
            return new AddNewCourseResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = new List<string> { "This course already exists." }
            };
        }

        var validator = new AddNewCourseValidator();
        var validationResult = validator.Validate(request);

        if (!validationResult.IsValid)
        {
            return new AddNewCourseResponse
            {
                Status = "Bad Request",
                Message = "Validation failed",
                Errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList()
            };
        }

        var course = new Course
        {
            CourseName = request.Name,
            CourseDescription = request.Description
        };

        var success = await _courseRepository.AddCourse(course);

        return new AddNewCourseResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Course added successfully" : "Failed to add course",
            Errors = success ? [""] : ["Something went wrong, please try again later"]
        };
    }
}
