import { useEffect, useMemo, useState } from "react";
import {
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";
import "./Home.css";

/* Get today's date without timezone problems */
const getTodayDate = () => {
    const currentDate = new Date();
    const timezoneOffset = currentDate.getTimezoneOffset() * 60000;

    return new Date(currentDate.getTime() - timezoneOffset)
        .toISOString()
        .split("T")[0];
};

/* Safely read data from localStorage */
const getStoredData = (key, fallbackValue) => {
    try {
        const storedValue = localStorage.getItem(key);

        return storedValue
            ? JSON.parse(storedValue)
            : fallbackValue;
    } catch (error) {
        console.error("Could not read stored data:", error);
        return fallbackValue;
    }
};

/* Create a unique student ID */
const createStudentId = () => {
    if (globalThis.crypto?.randomUUID) {
        return globalThis.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`;
};

/* Automatically generate the next roll number */
const getNextRollNumber = (students) => {
    const numericRollNumbers = students
        .map((student) => Number(student.rollNumber))
        .filter((rollNumber) => Number.isFinite(rollNumber));

    const highestRollNumber =
        numericRollNumbers.length > 0
            ? Math.max(...numericRollNumbers)
            : 0;

    return String(highestRollNumber + 1).padStart(2, "0");
};

function Students() {
    const navigate = useNavigate();
    const location = useLocation();
    const { sectionId } = useParams();

    const storageSectionId = sectionId || "default";

    const studentsStorageKey =
        `attendance-students-${storageSectionId}`;

    /*
     * These values can be passed from the previous page:
     *
     * navigate(`/sections/${sectionId}/students`, {
     *     state: {
     *         className: "Class 8",
     *         sectionName: "Section A"
     *     }
     * });
     */
   const className =
    location.state?.className || "Class";

const sectionName =
    location.state?.sectionName ||
    "Section Name";

const teacherName =
    location.state?.teacherName ||
    "Teacher Not Assigned";

    const [students, setStudents] = useState(() =>
        getStoredData(studentsStorageKey, [])
    );

    const [searchText, setSearchText] = useState("");
    const [activeAttendanceFilter, setActiveAttendanceFilter]= useState("all");
    const [attendanceDate, setAttendanceDate] =
        useState(getTodayDate);

    const [attendance, setAttendance] = useState({});
    const [savedMessage, setSavedMessage] = useState("");

    const [showAddStudentForm, setShowAddStudentForm] =
        useState(false);

    const [studentName, setStudentName] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [formError, setFormError] = useState("");

    const attendanceStorageKey =
        `attendance-record-${storageSectionId}-${attendanceDate}`;

    /* Save students automatically */
    useEffect(() => {
        try {
            localStorage.setItem(
                studentsStorageKey,
                JSON.stringify(students)
            );
        } catch (error) {
            console.error("Could not save students:", error);
        }
    }, [students, studentsStorageKey]);

    /* Load attendance whenever the date changes */
    useEffect(() => {
        const savedAttendance = getStoredData(
            attendanceStorageKey,
            {}
        );

        setAttendance(savedAttendance);
        setSavedMessage("");
    }, [attendanceStorageKey]);

    const filteredStudents = useMemo(() => {
    const searchValue = searchText.trim().toLowerCase();

    return students.filter((student) => {
        const studentNameValue = student.name.toLowerCase();
        const rollNumberValue = String(
            student.rollNumber
        ).toLowerCase();

        const matchesSearch =
            !searchValue ||
            studentNameValue.includes(searchValue) ||
            rollNumberValue.includes(searchValue);

        const studentStatus = attendance[student.id];

        let matchesAttendanceFilter = true;

        if (activeAttendanceFilter === "present") {
            matchesAttendanceFilter =
                studentStatus === "present";
        }

        if (activeAttendanceFilter === "absent") {
            matchesAttendanceFilter =
                studentStatus === "absent";
        }

        if (activeAttendanceFilter === "notMarked") {
            matchesAttendanceFilter =
                studentStatus !== "present" &&
                studentStatus !== "absent";
        }

        return matchesSearch && matchesAttendanceFilter;
    });
}, [
    students,
    searchText,
    attendance,
    activeAttendanceFilter,
]);

    const attendanceCounts = useMemo(() => {
        return students.reduce(
            (counts, student) => {
                const status = attendance[student.id];

                if (status === "present") {
                    counts.present += 1;
                } else if (status === "absent") {
                    counts.absent += 1;
                } else {
                    counts.notMarked += 1;
                }

                return counts;
            },
            {
                present: 0,
                absent: 0,
                notMarked: 0,
            }
        );
    }, [students, attendance]);

    const closeAddStudentForm = () => {
        setStudentName("");
        setRollNumber("");
        setFormError("");
        setShowAddStudentForm(false);
    };

    const openAddStudentForm = () => {
        setStudentName("");
        setRollNumber(
            getNextRollNumber(students)
        );
        setFormError("");
        setShowAddStudentForm(true);
    };

    const handleAddStudent = (event) => {
        event.preventDefault();

        const cleanedStudentName = studentName.trim();
        const cleanedRollNumber = rollNumber.trim();

        if (!cleanedStudentName) {
            setFormError(
                "Please enter the student's name."
            );
            return;
        }

        if (!cleanedRollNumber) {
            setFormError(
                "Please enter a roll number."
            );
            return;
        }

        const rollNumberAlreadyExists = students.some(
            (student) =>
                String(student.rollNumber)
                    .toLowerCase() ===
                cleanedRollNumber.toLowerCase()
        );

        if (rollNumberAlreadyExists) {
            setFormError(
                `Roll number ${cleanedRollNumber} already exists.`
            );
            return;
        }

        const newStudent = {
            id: createStudentId(),
            name: cleanedStudentName,
            rollNumber: cleanedRollNumber,
        };

        setStudents((previousStudents) => [
            ...previousStudents,
            newStudent,
        ]);

        closeAddStudentForm();
    };

    const handleAttendanceChange = (
        studentId,
        selectedStatus
    ) => {
        setAttendance((previousAttendance) => {
            const updatedAttendance = {
                ...previousAttendance,
            };

            /*
             * Clicking an already selected checkbox
             * will uncheck it.
             */
            if (
                updatedAttendance[studentId] ===
                selectedStatus
            ) {
                delete updatedAttendance[studentId];
                return updatedAttendance;
            }

            /*
             * A student can only be present or absent,
             * not both.
             */
            updatedAttendance[studentId] =
                selectedStatus;

            return updatedAttendance;
        });

        setSavedMessage("");
    };

    const handleDeleteStudent = (student) => {
        const confirmed = window.confirm(
            `Delete ${student.name}?\n\nThis action cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        setStudents((previousStudents) =>
            previousStudents.filter(
                (currentStudent) =>
                    currentStudent.id !== student.id
            )
        );

        setAttendance((previousAttendance) => {
            const updatedAttendance = {
                ...previousAttendance,
            };

            delete updatedAttendance[student.id];

            return updatedAttendance;
        });

        setSavedMessage("");
    };

    const handleDeleteAllStudents = () => {
        if (students.length === 0) {
            return;
        }

        const confirmed = window.confirm(
            `Delete all ${students.length} students?\n\nThis action cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        setStudents([]);
        setAttendance({});
        setSearchText("");
        setSavedMessage("");

        try {
            localStorage.removeItem(
                attendanceStorageKey
            );
        } catch (error) {
            console.error(
                "Could not remove attendance:",
                error
            );
        }
    };

    const handleSaveAttendance = () => {
        if (students.length === 0) {
            return;
        }

        try {
            localStorage.setItem(
                attendanceStorageKey,
                JSON.stringify(attendance)
            );

            setSavedMessage(
                "Attendance saved successfully."
            );

            window.setTimeout(() => {
                setSavedMessage("");
            }, 3000);
        } catch (error) {
            console.error(
                "Could not save attendance:",
                error
            );

            setSavedMessage(
                "Attendance could not be saved."
            );
        }
    };
    const handleAttendanceFilter = (filterName) => {
    setActiveAttendanceFilter((currentFilter) => {
        if (
            currentFilter === filterName &&
            filterName !== "all"
        ) {
            return "all";
        }

        return filterName;
    });
};


    return (
        <main className="students-page">
            <section className="students-card">
                <button
                    type="button"
                    className="students-back-button"
                    onClick={() => navigate(-1)}
                >
                    <span aria-hidden="true">←</span>
                    Back
                </button>

                <header className="students-header">
                    <p className="students-eyebrow">
                        Attendance Management
                    </p>

                    <h1>Student Attendance</h1>

                   <div className="students-subtitle">
    <span>{className}</span>

    <span className="subtitle-dot">•</span>

    <span>{sectionName}</span>

    <span className="subtitle-dot">•</span>

    <span className="teacher-name">
        Teacher: {teacherName}
    </span>

    <span className="subtitle-dot">•</span>

    <span>
        {students.length}{" "}
        {students.length === 1
            ? "Student"
            : "Students"}
    </span>
</div>
                </header>

            

                <section
    className="attendance-summary"
    aria-label="Filter students by attendance"
>
    <button
        type="button"
        className={`summary-card total-summary ${
            activeAttendanceFilter === "all"
                ? "active-summary-filter"
                : ""
        }`}
        onClick={() =>
            handleAttendanceFilter("all")
        }
        aria-pressed={
            activeAttendanceFilter === "all"
        }
    >
        <span>Total</span>
        <strong>{students.length}</strong>
    </button>

    <button
        type="button"
        className={`summary-card present-summary ${
            activeAttendanceFilter === "present"
                ? "active-summary-filter"
                : ""
        }`}
        onClick={() =>
            handleAttendanceFilter("present")
        }
        aria-pressed={
            activeAttendanceFilter === "present"
        }
    >
        <span>Present</span>

        <strong>
            {attendanceCounts.present}
        </strong>
    </button>

    <button
        type="button"
        className={`summary-card absent-summary ${
            activeAttendanceFilter === "absent"
                ? "active-summary-filter"
                : ""
        }`}
        onClick={() =>
            handleAttendanceFilter("absent")
        }
        aria-pressed={
            activeAttendanceFilter === "absent"
        }
    >
        <span>Absent</span>

        <strong>
            {attendanceCounts.absent}
        </strong>
    </button>

    <button
        type="button"
        className={`summary-card not-marked-summary ${
            activeAttendanceFilter === "notMarked"
                ? "active-summary-filter"
                : ""
        }`}
        onClick={() =>
            handleAttendanceFilter("notMarked")
        }
        aria-pressed={
            activeAttendanceFilter === "notMarked"
        }
    >
        <span>Not Marked</span>

        <strong>
            {attendanceCounts.notMarked}
        </strong>
    </button>
</section>

                <section className="students-toolbar">
                    <div className="students-search">
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                d="m21 21-4.35-4.35m2.35-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>

                        <input
                            type="search"
                            value={searchText}
                            onChange={(event) =>
                                setSearchText(
                                    event.target.value
                                )
                            }
                            placeholder="Search by name or roll number..."
                            aria-label="Search students"
                        />

                        {searchText && (
                            <button
                                type="button"
                                className="clear-search-button"
                                onClick={() =>
                                    setSearchText("")
                                }
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        className="add-student-button"
                        onClick={openAddStudentForm}
                    >
                        <span aria-hidden="true">＋</span>
                        Add Student
                    </button>
                </section>

                <section className="students-list-card">
                    <div className="students-table-header">
                        <span>Student</span>

                        <div className="table-action-headings">
                            <span>Present</span>
                            <span>Absent</span>
                            <span>Delete</span>
                        </div>
                    </div>

                    {filteredStudents.length > 0 ? (
                        <div className="students-list">
                            {filteredStudents.map(
                                (student) => {
                                    const studentStatus =
                                        attendance[
                                            student.id
                                        ];

                                    return (
                                        <article
                                            className="student-row"
                                            key={
                                                student.id
                                            }
                                        >
                                            <div className="student-details">
                                                <span className="student-roll">
                                                    {
                                                        student.rollNumber
                                                    }
                                                </span>

                                                <div className="student-avatar">
                                                    {student.name
                                                        .charAt(
                                                            0
                                                        )
                                                        .toUpperCase()}
                                                </div>

                                                <div className="student-name-area">
                                                    <h2>
                                                        {
                                                            student.name
                                                        }
                                                    </h2>

                                                    <p>
                                                        Roll
                                                        Number:{" "}
                                                        {
                                                            student.rollNumber
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="student-actions">
                                                <label
                                                    className="attendance-control present-control"
                                                    title="Present"
                                                >
                                                    <span className="mobile-control-label">
                                                        P
                                                    </span>

                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            studentStatus ===
                                                            "present"
                                                        }
                                                        onChange={() =>
                                                            handleAttendanceChange(
                                                                student.id,
                                                                "present"
                                                            )
                                                        }
                                                        aria-label={`Mark ${student.name} present`}
                                                    />

                                                    <span
                                                        className="attendance-box"
                                                        aria-hidden="true"
                                                    >
                                                        ✓
                                                    </span>
                                                </label>

                                                <label
                                                    className="attendance-control absent-control"
                                                    title="Absent"
                                                >
                                                    <span className="mobile-control-label">
                                                        A
                                                    </span>

                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            studentStatus ===
                                                            "absent"
                                                        }
                                                        onChange={() =>
                                                            handleAttendanceChange(
                                                                student.id,
                                                                "absent"
                                                            )
                                                        }
                                                        aria-label={`Mark ${student.name} absent`}
                                                    />

                                                    <span
                                                        className="attendance-box"
                                                        aria-hidden="true"
                                                    >
                                                        ✓
                                                    </span>
                                                </label>

                                                <button
                                                    type="button"
                                                    className="delete-student-button"
                                                    onClick={() =>
                                                        handleDeleteStudent(
                                                            student
                                                        )
                                                    }
                                                    aria-label={`Delete ${student.name}`}
                                                    title={`Delete ${student.name}`}
                                                >
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.8"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </article>
                                    );
                                }
                            )}
                        </div>
                    ) : (
                        <div className="students-empty-state">
                            <div className="empty-state-icon">
                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10-4v6m3-3h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            <h2>
    {students.length === 0
        ? "No students added yet"
        : searchText
        ? "No students found"
        : activeAttendanceFilter === "present"
        ? "No present students"
        : activeAttendanceFilter === "absent"
        ? "No absent students"
        : activeAttendanceFilter === "notMarked"
        ? "Everyone has been marked"
        : "No students found"}
</h2>

<p>
    {students.length === 0
        ? "Add your first student to begin taking attendance."
        : searchText
        ? `No student matches “${searchText}”.`
        : activeAttendanceFilter === "present"
        ? "No student is currently marked present."
        : activeAttendanceFilter === "absent"
        ? "No student is currently marked absent."
        : activeAttendanceFilter === "notMarked"
        ? "All students have an attendance status."
        : "No matching students are available."}
</p>

                            {students.length === 0 ? (
                                <button
                                    type="button"
                                    onClick={
                                        openAddStudentForm
                                    }
                                >
                                    ＋ Add First Student
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearchText("")
                                    }
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}
                </section>

                <footer className="students-footer">
                    <button
                        type="button"
                        className="delete-all-button"
                        onClick={
                            handleDeleteAllStudents
                        }
                        disabled={
                            students.length === 0
                        }
                    >
                        Delete All Students
                    </button>

                    <div className="save-attendance-area">
                        {savedMessage && (
                            <span
                                className="saved-message"
                                role="status"
                            >
                                {savedMessage}
                            </span>
                        )}

                        <button
                            type="button"
                            className="save-attendance-button"
                            onClick={
                                handleSaveAttendance
                            }
                            disabled={
                                students.length === 0
                            }
                        >
                            Save Attendance
                        </button>
                    </div>
                </footer>
            </section>

            {showAddStudentForm && (
                <div
                    className="add-student-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeAddStudentForm();
                        }
                    }}
                >
                    <form
                        className="add-student-modal"
                        onSubmit={handleAddStudent}
                    >
                        <div className="modal-header">
                            <div>
                                <p>Add New Student</p>
                                <h2>Student Details</h2>
                            </div>

                            <button
                                type="button"
                                className="close-modal-button"
                                onClick={
                                    closeAddStudentForm
                                }
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        <div className="student-form-field">
                            <label htmlFor="new-student-name">
                                Student Name
                            </label>

                            <input
                                id="new-student-name"
                                type="text"
                                value={studentName}
                                onChange={(event) => {
                                    setStudentName(
                                        event.target.value
                                    );
                                    setFormError("");
                                }}
                                placeholder="Enter full name"
                                autoFocus
                            />
                        </div>

                        <div className="student-form-field">
                            <label htmlFor="new-roll-number">
                                Roll Number
                            </label>

                            <input
                                id="new-roll-number"
                                type="text"
                                value={rollNumber}
                                onChange={(event) => {
                                    setRollNumber(
                                        event.target.value
                                    );
                                    setFormError("");
                                }}
                                placeholder="Example: 01"
                            />

                            <small>
                                The next available roll
                                number is filled
                                automatically.
                            </small>
                        </div>

                        {formError && (
                            <p
                                className="student-form-error"
                                role="alert"
                            >
                                {formError}
                            </p>
                        )}

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="cancel-modal-button"
                                onClick={
                                    closeAddStudentForm
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="confirm-student-button"
                            >
                                Add Student
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </main>
    );
}

export default Students;