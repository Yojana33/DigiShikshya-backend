using System;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;

public class StudentEnrollmentRepository : IStudentEnrollmentRepository
{
    private readonly IDbConnection _dbConnection;

    public StudentEnrollmentRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
        Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
    }

    // Add a new student enrollment
    public async Task<bool> AddStudentEnrollment(StudentEnrollment studentEnrollment)
    {
        var query = @"
            INSERT INTO studentenrollment (id, student_id, batch_id, semester_id, enrolled_date, created_at)
            VALUES (@Id, @StudentId, @BatchId, @SemesterId, @EnrolledDate, @CreatedAt)";

        var rowsAffected = await _dbConnection.ExecuteAsync(query, studentEnrollment);
        return rowsAffected > 0;
    }

    // Get a student enrollment by Id
    public async Task<StudentEnrollment> GetStudentEnrollmentById(Guid id)
    {
        var query = @"
           SELECT se.id AS Id,
           se.student_id AS StudentId,
           se.batch_id AS BatchId,
           se.semester_id AS SemesterId,
           se.enrolled_date AS EnrolledDate,
           b.start_date AS BatchStartDate,
           sem.semester_name AS SemesterName,
           c.course_name AS CourseName
    FROM studentenrollment se
    INNER JOIN batch b ON se.batch_id = b.id
    INNER JOIN semester sem ON se.semester_id = sem.id
    INNER JOIN course c ON sem.course_id = c.id
            WHERE se.id = @Id";

        var result = await _dbConnection.QuerySingleOrDefaultAsync<StudentEnrollment>(query, new { Id = id });
        return result!;
    }

    // Get all student enrollments with pagination
    public async Task<PaginatedResult<EnrollmentListResponse>> GetAllStudentEnrollments(EnrollmentListQuery request)
    {
        var totalCountQuery = "SELECT COUNT(*) FROM studentenrollment";
        var totalCount = await _dbConnection.ExecuteScalarAsync<int>(totalCountQuery);

        var query = @"
    SELECT se.id AS Id,
           se.student_id AS StudentId,
           se.batch_id AS BatchId,
           se.semester_id AS SemesterId,
           se.enrolled_date AS EnrolledDate,
           b.start_date AS BatchStartDate,
           sem.semester_name AS SemesterName,
           c.course_name AS CourseName
    FROM studentenrollment se
    INNER JOIN batch b ON se.batch_id = b.id
    INNER JOIN semester sem ON se.semester_id = sem.id
    INNER JOIN course c ON sem.course_id = c.id
    ORDER BY se.enrolled_date ASC
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

        var result = await _dbConnection.QueryAsync<EnrollmentListResponse>(query, new
        {
            Offset = (request.Page - 1) * request.PageSize,
            PageSize = request.PageSize
        });

        return new PaginatedResult<EnrollmentListResponse>
        {
            Items = result.ToList(),
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }

    // Update a student enrollment
    public async Task<bool> UpdateStudentEnrollment(StudentEnrollment studentEnrollment)
    {
        var query = @"
            UPDATE studentenrollment
            SET student_id = @StudentId, 
                batch_id = @BatchId,
                semester_id = @SemesterId,
                enrolled_date = @EnrolledDate,
                updated_at = @UpdatedAt
            WHERE id = @Id";

        var rowsAffected = await _dbConnection.ExecuteAsync(query, studentEnrollment);
        return rowsAffected > 0;
    }

    // Delete a student enrollment by Id
    public async Task<bool> DeleteStudentEnrollment(Guid id)
    {
        var query = "DELETE FROM studentenrollment WHERE id = @Id";

        var rowsAffected = await _dbConnection.ExecuteAsync(query, new { Id = id });
        return rowsAffected > 0;
    }
}
