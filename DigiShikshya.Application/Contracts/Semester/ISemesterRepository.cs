public interface ISemesterRepository
{
    Task<PaginatedResult<Semester>> GetAllSemesters(SemesterListQuery request);
    Task<Semester> GetSemesterById(Guid id);
    Task<bool> AddSemester(Semester semester);
    Task<bool> UpdateSemester(Semester semester);
    Task<bool> DeleteSemester(Guid id);
    Task<bool> SemesterAlreadyExists(string semesterName);
}
//