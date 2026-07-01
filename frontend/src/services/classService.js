import api from "../api/api";

export const getClasses = async (schoolId) => {

    const response = await api.get(
        `/schools/${schoolId}/classes`
    );

    return response.data;
};

export const createClass = async (
    schoolId,
    className
) => {

    const response = await api.post(
        `/schools/${schoolId}/classes`,
        {
            className
        }
    );

    return response.data;
};