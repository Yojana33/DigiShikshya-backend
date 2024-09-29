using MediatR;

public class AddNewCourse: IRequest<AddNewCourseResponse>
{
    public   string? Name { get; set; }
    public  string? Description { get; set; }
    
}