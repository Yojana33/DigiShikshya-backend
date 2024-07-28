
using System.Data;
using Dapper;
using Microsoft.Extensions.Logging;

public class CourseRepository(IDbConnection _dbConnection) : ICourseRepository
{

    public async Task<bool> AddCourse(Course course)
    {

        var query = "INSERT INTO course (id, course_name, course_description,created_at) VALUES (@Id, @CourseName, @Description, @CreatedAt)";
        await _dbConnection.ExecuteScalarAsync<bool>(query, course);
        return true;



    }

    public Task<bool> DeleteCourse(Guid id)
    {
        throw new NotImplementedException();
    }

    public async Task<PaginatedResult<Course>> GetAllCourses(CourseListQuery request)
    {

        var totalCount = await _dbConnection.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM course");
        var query = "SELECT * FROM course ORDER BY created_at DESC LIMIT @PageSize OFFSET @PageSize * (@Page - 1)";
        var result = await _dbConnection.QueryAsync<Course>(query, new { request.PageSize, request.Page });
        return new PaginatedResult<Course>
        {
            Items = result.ToList(),
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };


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