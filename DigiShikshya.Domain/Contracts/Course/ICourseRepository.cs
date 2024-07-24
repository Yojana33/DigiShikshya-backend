public interface ICourseRepository
{
    Task<List<Course>> GetAllCourses();
    Task<Course> GetCourseById(Guid id);
    Task<bool> AddCourse(Course course);
    Task<bool> UpdateCourse(Course course);
    Task<bool> DeleteCourse(Guid id);
}