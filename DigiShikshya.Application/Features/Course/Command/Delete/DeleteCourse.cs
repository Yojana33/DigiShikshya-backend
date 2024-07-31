using MediatR;

public class DeleteCourse : IRequest<DeleteCourseResponse>
{
    public required Guid Id { get; set; }
}
