public interface IStudentEnrollmentRepository
{
    Task<PaginatedResult<EnrollmentListResponse>> GetAllStudentEnrollments(EnrollmentListQuery request);
    Task<StudentEnrollment> GetStudentEnrollmentById(Guid id);
    Task<bool> AddStudentEnrollment(StudentEnrollment studentEnrollment);
    Task<bool> UpdateStudentEnrollment(StudentEnrollment studentEnrollment);
    Task<bool> DeleteStudentEnrollment(Guid id);
}
