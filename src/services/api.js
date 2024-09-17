// Example service for fetching students from an API (if applicable)
export const fetchStudents = async () => {
  const response = await fetch('https://example.com/api/students');
  return response.json();
};
