using MediatR;
public class StudentDashboardQuery : IRequest<StudentDashboard>
{
    public Guid StudentId { get; set; }

}
