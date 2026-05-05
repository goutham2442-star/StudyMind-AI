export const SUBJECTS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Economics",
  "Psychology",
  "Political Science",
  "History",
  "English Literature",
  "Law",
  "Medicine",
  "Business Administration",
  "Sociology",
  "Philosophy",
  "Architecture",
  "Environmental Science"
];

export const YEARS = Array.from({ length: 2025 - 2018 + 1 }, (_, i) => 2018 + i).reverse();

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
