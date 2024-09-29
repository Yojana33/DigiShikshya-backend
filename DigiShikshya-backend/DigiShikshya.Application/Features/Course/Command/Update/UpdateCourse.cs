using MediatR;

public class UpdateCourse : IRequest<UpdateCourseResponse>
{
    public required Guid Id { get; set; }
    public string? NewName { get; set; }
    public string? NewDescription { get; set; }

}