using MediatR;
public class StudentDashboardHandler(IStudentDashboardRepository _studentDashboardRepository, ISemesterRepository _semesterRepository) : IRequestHandler<StudentDashboardQuery, StudentDashboard>
{
    public async Task<StudentDashboard> Handle(StudentDashboardQuery request, CancellationToken cancellationToken)
    {
        return await _studentDashboardRepository.GetDashboardData(request.StudentId);
    }
}

