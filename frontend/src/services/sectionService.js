import api from "../api/api";

export const getSections = async (schoolId, classId) => {

    const response = await api.get(
        `/schools/${schoolId}/classes/${classId}/sections`
    );

    return response.data;
};

export const createSection = async (
    schoolId,
    classId,
    teacherName
) => {

    const response = await api.post(
        `/schools/${schoolId}/classes/${classId}/sections`,
        {
            teacherName
        }
    );

    return response.data;
};