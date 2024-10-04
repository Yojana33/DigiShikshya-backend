import axiosInstance from '@/config/axiosconfig';

export const fetchBatches = async () => {
  const response = await axiosInstance.get('/api/v1/batch/all');
  return response.data;
};

export const addBatch = async (batch) => {
  const response = await axiosInstance.post('/api/v1/batch/add', batch);
  return response.data;
};

export const updateBatch = async (batch) => {
  const response = await axiosInstance.put(`/api/v1/batch/update`, batch);
  return response.data;
};

export const deleteBatch = async (batchId) => {
  const response = await axiosInstance.delete(`/api/v1/batch/${id}`);
  return response.data;
};

export const fetchCourses = async () => {
  const response = await axiosInstance.get('/api/v1/course/all');
  return response.data;
};

export const addCourse = async (course) => {
  const response = await axiosInstance.post('/api/v1/course/add', course);
  return response.data;
};

export const updateCourse = async (course) => {
  const response = await axiosInstance.put(`/api/v1/course/update`, course);
  return response.data;
};

export const deleteCourse = async (courseId) => {
  const response = await axiosInstance.delete(`/api/v1/course/${id}`);
  return response.data;
};


export const fetchSemesters = async () => {
  const response = await axiosInstance.get('/api/v1/semester/all');
  return response.data;
};

export const addSemester = async (semester) => {
  const response = await axiosInstance.post('/api/v1/semester/add', semester);
  return response.data;
};

export const updateSemester = async (semester) => {
  const response = await axiosInstance.put(`/api/v1/semester/update`, semester);
  return response.data;
};

export const deleteSemester = async (semesterId) => {
  const response = await axiosInstance.delete(`/api/v1/semester/${id}`);
  return response.data;
};
export const fetchEnrollments = async () => {
  const response = await axiosInstance.get('/api/v1/enrollment/all');
  return response.data;
};

export const addEnrollment = async (enrollment) => {
  const response = await axiosInstance.post('/api/v1/enrollment/enroll', enrollment);
  return response.data;
};

export const updateEnrollment = async (enrollment) => {
  const response = await axiosInstance.put(`/api/v1/enrollment/update`, enrollment);
  return response.data;
};

export const deleteEnrollment = async (enrollmentId) => {
  const response = await axiosInstance.delete(`/api/v1/enrollment/delete`);
  return response.data;
};
// export const fetchStudents = async () => {
//   const response = await axiosInstance.get('/api/v1/students');
//   return response.data;
// }; //api for this is not available
export const fetchSubjects = async () => {
  const response = await axiosInstance.get('/api/v1/subject/all');
  return response.data;
};

export const addSubject = async (subject) => {
  const response = await axiosInstance.post('/api/v1/subject/add', subject);
  return response.data;
};

export const updateSubject = async (subject) => {
  const response = await axiosInstance.put(`/api/v1/subject/update`, subject);
  return response.data;
};

export const deleteSubject = async (subjectId) => {
  const response = await axiosInstance.delete(`/api/v1/subject/delete`);
  return response.data;
};
export const fetchTeacherAssignments = async () => {
  const response = await axiosInstance.get('/api/v1/teacher-assign/all');
  return response.data;
};

export const addTeacherAssignment = async (assignment) => {
  const response = await axiosInstance.post('/api/v1/teacher-assign/assign', assignment);
  return response.data;
};

export const updateTeacherAssignment = async (assignment) => {
  const response = await axiosInstance.put(`/api/v1/teacher-assign/update`, assignment);
  return response.data;
};

export const deleteTeacherAssignment = async (assignmentId) => {
  const response = await axiosInstance.delete(`/api/v1/teacher-assign/delete`);
  return response.data;
};
export const fetchMaterials = async () => {
  const response = await axiosInstance.get('/api/v1/material/all');
  return response.data;
};

export const addMaterial = async (material) => {
  const response = await axiosInstance.post('/api/v1/material/add', material);
  return response.data;
};

export const updateMaterial = async (material) => {
  const response = await axiosInstance.put(`/api/v1/material/update`, material);
  return response.data;
};

export const deleteMaterial = async (materialId) => {
  const response = await axiosInstance.delete(`/api/v1/material/delete/${id}`);
  return response.data;
};
export const fetchAssignments = async () => {
  const response = await axiosInstance.get('/api/v1/assignmen/all');
  return response.data;
};

export const addAssignment = async (assignment) => {
  const response = await axiosInstance.post('/api/v1/assignment/add', assignment);
  return response.data;
};

export const updateAssignment = async (assignment) => {
  const response = await axiosInstance.put(`/api/v1/assignment/update`, assignment);
  return response.data;
};

export const deleteAssignment = async (assignmentId) => {
  const response = await axiosInstance.delete(`/api/v1/assignment/${id}`);
  return response.data;
};
export const fetchSubmissions = async () => {
  const response = await axiosInstance.get('/api/v1/submission/all');
  return response.data;
};

export const addSubmission = async (submission) => {
  const response = await axiosInstance.post('/api/v1/submission/add', submission);
  return response.data;
};

// export const updateSubmission = async (submission) => {
//   const response = await axiosInstance.put(`/api/v1/submission/${submission.id}`, submission);
//   return response.data;
// };

// export const deleteSubmission = async (submissionId) => {
//   const response = await axiosInstance.delete(`/api/v1/submission/${submissionId}`);
//   return response.data;
// };