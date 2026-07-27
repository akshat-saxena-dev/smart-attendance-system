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
    `/attendance/sections/${sectionId}/attendance/${date}`
  );

  return response.data;
};

export const getAttendanceByDate = async (sectionId, date) => {
  const response = await api.get(
    `/attendance/${sectionId}/${date}`
  );

  return response.data;
};

export const updateAttendance = async (
  studentId,
  attendanceDate,
  status,
  accessCode
) => {
  const response = await api.put("/attendance/update", {
    studentId,
    attendanceDate,
    status,
    accessCode,
  });

  return response.data;
};