using System.ComponentModel.DataAnnotations;
using MediatR;

public class AddNewCourseHandler(ICourseRepository _courseRepository) : IRequestHandler<AddNewCourse, AddNewCourseResponse>
{
    public async Task<AddNewCourseResponse> Handle(AddNewCourse request, CancellationToken cancellationToken)
    {
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
            Name = request.Name,
            Description = request.Description
        };

        var success = await _courseRepository.AddCourse(course);

        return new AddNewCourseResponse
        {
            Status = success ? "Success" : "Failed",
            Message = success ? "Course added successfully" : "Failed to add course",
            Errors = ["Something went wrong, please try again later"]
        };
    }
}