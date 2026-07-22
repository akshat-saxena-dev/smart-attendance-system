import api from "../api/api";

export const addStudents = async (sectionId, students) => {
    const response = await api.post(
        `/sections/${sectionId}/students`,
        { students }
    );

    return response.data;
};

export const getStudents = async (sectionId) => {
    const response = await api.get(
        `/sections/${sectionId}/students`
    );

    return response.data;
};