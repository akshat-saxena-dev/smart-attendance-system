import api from "../api/api";

export const saveAttendance = async (date, attendance) => {
    const response = await api.post("/attendance", {
        date,
        attendance,
    });

    return response.data;
};

export const checkAttendance = async (sectionId, date) => {
    const response = await api.get(
        `/sections/${sectionId}/attendance/${date}`
    );

    return response.data;
};