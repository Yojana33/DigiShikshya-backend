using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;

public class SubmissionRepository : ISubmissionRepository
{
    private readonly IDbConnection _dbConnection;

    public SubmissionRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
        Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
    }

    public async Task<bool> AddSubmission(Submission submission)
    {
        var query = @"
            INSERT INTO submission (id, assignment_id, student_id, submitted_file, submitted_at, status, created_at)
            VALUES (@Id, @AssignmentId, @StudentId, @SubmittedFile, @Submitted_at, @Status, @CreatedAt)";

        await _dbConnection.ExecuteAsync(query, submission);
        return true;
    }

    public async Task<PaginatedResult<SubmissionListResponse>> GetAllSubmissions(SubmissionListQuery request)
    {
        var totalCountQuery = "SELECT COUNT(*) FROM submission";
        var totalCount = await _dbConnection.ExecuteScalarAsync<int>(totalCountQuery);

        var query = @"
            SELECT s.id AS Id, 
                   s.assignment_id AS AssignmentId, 
                   s.student_id AS StudentId, 
                   s.submitted_file AS SubmittedFile, 
                   s.submitted_at AS SubmittedAt, 
                   s.status AS Status,
                   a.title AS AssignmentTitle,
                   a.due_date AS DueDate,
                   sub.subject_name AS SubjectName,
                   t.teacher_name AS TeacherName,
                   b.batch_name AS BatchName,
                   c.course_name AS CourseName,
                   sem.semester_name AS SemesterName
            FROM submission s
            INNER JOIN assignment a ON s.assignment_id = a.id
            INNER JOIN subject sub ON a.subject_id = sub.id
            INNER JOIN teacher t ON a.teacher_id = t.id
            INNER JOIN batch b ON a.batch_id = b.id
            INNER JOIN course c ON b.course_id = c.id
            INNER JOIN semester sem ON b.semester_id = sem.id
            ORDER BY s.submitted_at DESC 
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

        var result = await _dbConnection.QueryAsync<SubmissionListResponse>(query, new
        {
            Offset = (request.Page - 1) * request.PageSize,
            PageSize = request.PageSize
        });

        return new PaginatedResult<SubmissionListResponse>
        {
            Items = result.ToList(),
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }

    public async Task<Submission> GetSubmissionById(Guid id)
    {
        var query = @"
            SELECT s.id AS Id, 
                   s.assignment_id AS AssignmentId, 
                   s.student_id AS StudentId, 
                   s.submitted_file AS SubmittedFile, 
                   s.submitted_at AS SubmittedAt, 
                   s.status AS Status,
                   a.title AS AssignmentTitle,
                   a.due_date AS DueDate,
                   sub.subject_name AS SubjectName,
                   t.teacher_name AS TeacherName,
                   b.batch_name AS BatchName,
                   c.course_name AS CourseName,
                   sem.semester_name AS SemesterName
            FROM submission s
            INNER JOIN assignment a ON s.assignment_id = a.id
            INNER JOIN subject sub ON a.subject_id = sub.id
            INNER JOIN teacher t ON a.teacher_id = t.id
            INNER JOIN batch b ON a.batch_id = b.id
            INNER JOIN course c ON b.course_id = c.id
            INNER JOIN semester sem ON b.semester_id = sem.id
            WHERE s.id = @Id";

        var result = await _dbConnection.QuerySingleOrDefaultAsync<Submission>(query, new { Id = id });
        return result!;
    }
}
