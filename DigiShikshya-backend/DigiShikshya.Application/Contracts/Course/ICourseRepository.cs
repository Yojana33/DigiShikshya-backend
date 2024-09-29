public interface ICourseRepository
{
    Task<PaginatedResult<Course>> GetAllCourses(CourseListQuery request);
    Task<Course> GetCourseById(Guid id);
    Task<bool> AddCourse(Course course);
    Task<bool> UpdateCourse(Course course);
    Task<bool> DeleteCourse(Guid id);

    Task<bool> CourseNameExists(string courseName);
}