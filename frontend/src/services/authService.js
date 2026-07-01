import api from "../api/api";

export const loginSchool = async (schoolId, password) => {
    const response = await api.post("/login", {
        schoolId,
        password
    });

    return response.data;
};

export const registerSchool = async (schoolName, password) => {
    const response = await api.post("/register", {
        schoolName,
        password
    });

    return response.data;
};