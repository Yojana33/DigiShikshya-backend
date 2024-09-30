using System;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;

public class TeacherAssignRepository : ITeacherAssignRepository
{
    private readonly IDbConnection _dbConnection;

    public TeacherAssignRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
        Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
    }

    // Add a new teacher assignment
    public async Task<bool> AssignTeacher(TeacherAssign teacherAssign)
    {
        var query = @"
            INSERT INTO teacher_assign (id, teacher_id, subject_id, created_at)
            VALUES (@Id, @TeacherId, @SubjectId, @CreatedAt)";

        var rowsAffected = await _dbConnection.ExecuteAsync(query, teacherAssign);
        return rowsAffected > 0;
    }

    // Get a teacher assignment by Id
    public async Task<TeacherAssign> GetTeacherAssignmentById(Guid id)
    {
        var query = @"
            SELECT ta.id AS Id, 
                   ta.teacher_id AS TeacherId, 
                   ta.subject_id AS SubjectId,
                   sub.subject_name AS SubjectName,
                   u.user_name AS TeacherName
            FROM teacher_assign ta
            INNER JOIN subject sub ON ta.subject_id = sub.id
            INNER JOIN userprofile u ON ta.teacher_id = u.user_id
            WHERE ta.id = @Id";

        var result = await _dbConnection.QuerySingleOrDefaultAsync<TeacherAssign>(query, new { Id = id });
        return result!;
    }

    // Get all teacher assignments with pagination
    public async Task<PaginatedResult<TeacherAssignListResponse>> GetAllTeacherAssignments(TeacherAssignListQuery request)
    {
        var totalCountQuery = "SELECT COUNT(*) FROM teacher_assign";
        var totalCount = await _dbConnection.ExecuteScalarAsync<int>(totalCountQuery);

        var query = @"
            SELECT ta.id AS Id,
                   ta.teacher_id AS TeacherId,
                   ta.subject_id AS SubjectId,
                   sub.subject_name AS SubjectName,
                   u.user_name AS TeacherName,
                   b.batch_name AS BatchName,
                   c.course_name AS CourseName,
                   sem.semester_name AS SemesterName
            FROM teacher_assign ta
            INNER JOIN subject sub ON ta.subject_id = sub.id
            INNER JOIN userprofile u ON ta.teacher_id = u.user_id
            INNER JOIN batch b ON sub.batch_id = b.id
            INNER JOIN course c ON b.course_id = c.id
            INNER JOIN semester sem ON b.semester_id = sem.id
            ORDER BY u.user_name ASC
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

        var result = await _dbConnection.QueryAsync<TeacherAssignListResponse>(query, new
        {
            Offset = (request.Page - 1) * request.PageSize,
            PageSize = request.PageSize
        });

        return new PaginatedResult<TeacherAssignListResponse>
        {
            Items = result.ToList(),
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }

    // Update a teacher assignment
    public async Task<bool> UpdateTeacherAssignment(TeacherAssign teacherAssign)
    {
        var query = @"
            UPDATE teacher_assign
            SET teacher_id = @TeacherId, 
                subject_id = @SubjectId,
                updated_at = @UpdatedAt
            WHERE id = @Id";

        var rowsAffected = await _dbConnection.ExecuteAsync(query, teacherAssign);
        return rowsAffected > 0;
    }

    // Delete a teacher assignment by Id
    public async Task<bool> DeleteTeacherAssignment(Guid id)
    {
        var query = "DELETE FROM teacher_assign WHERE id = @Id";

        var rowsAffected = await _dbConnection.ExecuteAsync(query, new { Id = id });
        return rowsAffected > 0;
    }
}
