public interface IStudentDashboardRepository
{
    Task<StudentDashboard> GetDashboardData(Guid studentId);
}