using System.Data;
using System.Threading.Tasks;
using Dapper;
using System.Collections.Generic;
using System.Linq;

public class AssignmentRepository : IAssignmentRepository
{
    private readonly IDbConnection _dbConnection;

    public AssignmentRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
        Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
    }

    public async Task<bool> AddAssignment(Assignment assignment)
    {
        var query = @"
            INSERT INTO assignments (id, title, description, due_date, subject_id, teacher_id, created_at) 
            VALUES (@Id, @Title, @Description, @DueDate, @SubjectId, @TeacherId, @CreatedAt)";

        await _dbConnection.ExecuteAsync(query, assignment);
        return true;
    }

    public async Task<PaginatedResult<AssignmentListResponse>> GetAllAssignments(AssignmentListQuery request)
    {
        var totalCountQuery = "SELECT COUNT(*) FROM assignments";
        var totalCount = await _dbConnection.ExecuteScalarAsync<int>(totalCountQuery);

        var query = @"
            SELECT a.id AS Id, 
                   a.title AS Title, 
                   a.description AS Description, 
                   a.due_date AS DueDate, 
                   a.subject_id AS SubjectId, 
                   s.subject_name AS SubjectName, 
                   s.subject_code AS SubjectCode, 
                   b.start_date AS BatchStartDate, 
                   sem.semester_name AS SemesterName, 
                   c.course_name AS CourseName, 
                   a.teacher_id AS TeacherId, 
                   u.first_name || ' ' || u.last_name AS TeacherName,
                   a.created_at AS CreatedAt 
            FROM assignments a
            INNER JOIN subjects s ON a.subject_id = s.id  
            INNER JOIN batch b ON s.batch_id = b.id  -- Join with batch table
            INNER JOIN semester sem ON b.semester_id = sem.id  -- Join with semester table
            INNER JOIN course c ON sem.course_id = c.id  -- Join with course table via semester
            LEFT JOIN userprofile u ON a.teacher_id = u.user_id
            ORDER BY a.created_at DESC 
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

        var result = await _dbConnection.QueryAsync<AssignmentListResponse>(query, new
        {
            Offset = (request.Page - 1) * request.PageSize,
            PageSize = request.PageSize
        });

        return new PaginatedResult<AssignmentListResponse>
        {
            Items = result.ToList(),
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }

    public async Task<Assignment> GetAssignmentById(Guid id)
    {
        var query = @"
            SELECT a.id AS Id, 
                   a.title AS Title, 
                   a.description AS Description, 
                   a.due_date AS DueDate, 
                   a.subject_id AS SubjectId, 
                   s.subject_name AS SubjectName, 
                   s.subject_code AS SubjectCode, 
                   b.start_date AS BatchStartDate, 
                   sem.semester_name AS SemesterName, 
                   c.course_name AS CourseName, 
                   a.teacher_id AS TeacherId, 
                   u.first_name || ' ' || u.last_name AS TeacherName,
                   a.created_at AS CreatedAt 
            FROM assignments a
            INNER JOIN subjects s ON a.subject_id = s.id  
            INNER JOIN batch b ON s.batch_id = b.id  -- Join with batch table
            INNER JOIN semester sem ON b.semester_id = sem.id  -- Join with semester table
            INNER JOIN course c ON sem.course_id = c.id  -- Join with course table via semester
            LEFT JOIN userprofile u ON a.teacher_id = u.user_id
            WHERE a.id = @Id";

        var result = await _dbConnection.QuerySingleOrDefaultAsync<Assignment>(query, new { Id = id });
        return result!;
    }

    public async Task<bool> UpdateAssignment(Assignment assignment)
    {
        var query = @"
            UPDATE assignments 
            SET 
                title = @Title, 
                description = @Description, 
                due_date = @DueDate, 
                subject_id = @SubjectId,
                teacher_id = @TeacherId, 
                updated_at = @UpdatedAt 
            WHERE id = @Id";

        var result = await _dbConnection.ExecuteAsync(query, assignment);
        return result > 0;
    }

    public async Task<bool> DeleteAssignment(Guid id)
    {
        var query = "DELETE FROM assignments WHERE id = @Id";

        var result = await _dbConnection.ExecuteAsync(query, new { Id = id });
        return result > 0;
    }
}
