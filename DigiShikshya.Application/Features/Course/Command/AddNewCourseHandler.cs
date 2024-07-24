using MediatR;

public class AddNewCourseHandler(ICourseRepository _courseRepository) : IRequestHandler<AddNewCourse, AddNewCourseResponse>
{
    public async Task<AddNewCourseResponse> Handle(AddNewCourse request, CancellationToken cancellationToken)
    {
        var response = new AddNewCourseResponse();
        var validator = new AddNewCourseValidator();
        var validationResult = validator.Validate(request);

        if (validationResult.IsValid)
        {
            var course = new Course
            {
                Name = request.Name,
                Description = request.Description
            };

            var success = await _courseRepository.AddCourse(course);
            response.IsSuccess = success;
            response.Message = success ? ["Course added successfully"] : ["Failed to add course"];
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