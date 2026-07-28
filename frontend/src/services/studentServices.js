import api from "../api/api";

const API_URL = "http://localhost:5000";

export const addStudents = async (sectionId, students) => {
    const response = await api.post(
        `/sections/${sectionId}/students`,
        { students }
    );

    return response.data;
};

export const addStudent = async (sectionId, rollNo, studentName) => {
    const response = await api.post(
        `/sections/${sectionId}/student`,
        {
            rollNo,
            studentName
        }
    );

    return response.data;
};

export const getStudents = async (sectionId) => {
    const response = await api.get(
        `/sections/${sectionId}/students`
    );

    return response.data;
};

export const deleteStudents = async (sectionId) => {
    const response = await api.delete(
        `/sections/${sectionId}/students`
    );

    return response.data;
};


export const deleteStudent = async (studentId) => {
  const response = await api.delete(`/student/${studentId}`);
  return response.data;
};


export const uploadStudentImage = async (image) => {
  const formData = new FormData();

  formData.append("image", image);

  const response = await api.post("/ocr", formData);

  return response.data;
};