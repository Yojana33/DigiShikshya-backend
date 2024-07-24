
using System.Data;
using Dapper;

public class CourseRepository(IDbConnection _dbConnection) : ICourseRepository
{
    public async Task<bool> AddCourse(Course course)
    {
        var query = "INSERT INTO course (id, course_name, course_description,created_at) VALUES (@Id, @Name, @Description, @CreatedAt)";
        var result = await _dbConnection.ExecuteScalarAsync<bool>(query, course);
        return result;
    }

    public Task<bool> DeleteCourse(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<List<Course>> GetAllCourses()
    {
        throw new NotImplementedException();
    }

    public Task<Course> GetCourseById(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UpdateCourse(Course course)
    {
        throw new NotImplementedException();
    }
}