
using System.Data;
using Dapper;
using Microsoft.Extensions.Logging;

public class CourseRepository : ICourseRepository
{
    public CourseRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
        Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
    }
    private readonly IDbConnection _dbConnection;

    public async Task<bool> AddCourse(Course course)
    {

        var query = "INSERT INTO course (id, course_name, course_description,created_at) VALUES (@Id, @CourseName, @CourseDescription, @CreatedAt)";
        await _dbConnection.ExecuteScalarAsync<bool>(query, course);
        return true;



    }

    public async Task<bool> DeleteCourse(Guid id)
    {
        var query = "DELETE FROM course WHERE id = @Id";
        var result = await _dbConnection.ExecuteAsync(query, new { Id = id });
        return result > 0;

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

    public async Task<Course> GetCourseById(Guid id)
    {
        var query = "SELECT * FROM course WHERE id = @Id";
        var result = await _dbConnection.QuerySingleOrDefaultAsync<Course>(query, new { Id = id });
        return result!;

    }

    public async Task<bool> UpdateCourse(Course course)
    {
        var query = "UPDATE course SET course_name = @CourseName, course_description = @CourseDescription, updated_at = @UpdatedAt WHERE id = @Id";
        await _dbConnection.ExecuteScalarAsync<bool>(query, course);
        return true;

    }
}