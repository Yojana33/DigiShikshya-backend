public interface ITeacherAssignRepository
{
    Task<PaginatedResult<TeacherAssignListResponse>> GetAllTeacherAssignments(TeacherAssignListQuery request);
    //Task<TeacherAssign> GetAssignmentBySubjectId(Guid subjectId);
    Task<bool> AssignTeacher(TeacherAssign teacherAssign);
    Task<TeacherAssign> GetTeacherAssignmentById(Guid id);
    Task<bool> DeleteTeacherAssignment(Guid id);
    //Task<List<TeacherAssign>> GetAssignmentsByTeacherId(Guid teacherId);
    Task<bool> UpdateTeacherAssignment(TeacherAssign teacherAssign);
}
