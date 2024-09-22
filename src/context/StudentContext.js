import React, { createContext, useState, useCallback } from 'react';

export const StudentContext = createContext();

export function StudentProvider({ children }) {
  const [students, setStudents] = useState({});

  const fetchStudents = useCallback(async (floor, room) => {
    try {
      const response = await fetch(`http://192.168.68.112:3000/api/floors/${floor}/rooms/${room}/students`);
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      setStudents((prevStudents) => ({
        ...prevStudents,
        [floor]: {
          ...prevStudents[floor],
          [room]: data,
        },
      }));
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }, []);

  return (
    <StudentContext.Provider value={{ students, fetchStudents }}>
      {children}
    </StudentContext.Provider>
  );
}
