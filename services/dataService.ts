import { Student, SemesterResult, GradeLevel, Subject, SUBJECT_LIST } from "../types";

const STUDENTS_KEY = 'gps_bazar_students';
const RESULTS_KEY = 'gps_bazar_results';

// Seed data helper
const seedData = () => {
  if (!localStorage.getItem(STUDENTS_KEY)) {
    const students: Student[] = [
      {
        id: '1',
        regNo: 'REG-001',
        name: 'Ahmed Khan',
        fatherName: 'Sher Khan',
        contactNumber: '0300-1234567',
        grade: 5,
        pictureUrl: 'https://picsum.photos/seed/ahmed/200/200',
        dateOfBirth: '2013-05-15',
        formB: '12345-1234567-1'
      },
      {
        id: '2',
        regNo: 'REG-002',
        name: 'Fatima Bibi',
        fatherName: 'Muhammad Ali',
        contactNumber: '0333-9876543',
        grade: 5,
        pictureUrl: 'https://picsum.photos/seed/fatima/200/200',
        dateOfBirth: '2013-08-20',
        formB: '12345-7654321-2'
      }
    ];
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  }

  if (!localStorage.getItem(RESULTS_KEY)) {
    const results: SemesterResult[] = [
      {
        studentId: 'REG-001',
        semester: 1,
        scores: {
          [Subject.ENGLISH]: 85,
          [Subject.URDU]: 78,
          [Subject.MATH]: 92,
          [Subject.G_SCIENCE]: 88,
          [Subject.PASHTO]: 80,
          [Subject.SOCIAL_STUDY]: 75,
          [Subject.ISLAMIYAT]: 95,
          [Subject.NAZIRA_QURAN]: 98,
          [Subject.DRAWING]: 85
        },
        totalMarks: 900,
        obtainedMarks: 776,
        percentage: 86.2
      }
    ];
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  }
};

export const initData = () => seedData();

export const getStudents = (): Student[] => {
  const data = localStorage.getItem(STUDENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveStudent = (student: Student) => {
  const students = getStudents();
  const existingIndex = students.findIndex(s => s.regNo === student.regNo);
  
  if (existingIndex >= 0) {
    students[existingIndex] = student;
  } else {
    students.push(student);
  }
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
};

export const getResults = (): SemesterResult[] => {
  const data = localStorage.getItem(RESULTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveResult = (result: SemesterResult) => {
  const results = getResults();
  // Overwrite if exists for same student + semester
  const existingIndex = results.findIndex(r => r.studentId === result.studentId && r.semester === result.semester);
  
  if (existingIndex >= 0) {
    results[existingIndex] = result;
  } else {
    results.push(result);
  }
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
};

// Utilities for CSV Processing
export const parseStudentCSV = (csvText: string): Student[] => {
  const lines = csvText.trim().split('\n');
  const students: Student[] = [];
  
  // Skip header, assuming: Name,FatherName,Contact,Class,RegNo,DOB,FormB
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map(s => s.trim());
    if (parts.length >= 5) {
      students.push({
        id: crypto.randomUUID(),
        name: parts[0],
        fatherName: parts[1],
        contactNumber: parts[2],
        grade: parseInt(parts[3]) as GradeLevel,
        regNo: parts[4],
        pictureUrl: `https://picsum.photos/seed/${parts[4]}/200/200`,
        dateOfBirth: parts[5] || '',
        formB: parts[6] || ''
      });
    }
  }
  return students;
};

export const parseResultCSV = (csvText: string): SemesterResult[] => {
  const lines = csvText.trim().split('\n');
  const results: SemesterResult[] = [];

  // Skip header
  // Assumed Header: RegNo,Semester,English,Urdu,Math,Science,Pashto,SocialStudy,Islamiyat,Nazira,Drawing
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map(s => s.trim());
    if (parts.length >= 11) {
      const scores: Record<string, number> = {};
      let obtained = 0;
      
      // Map columns to subjects manually based on assumed index
      const subjectValues = parts.slice(2);
      
      SUBJECT_LIST.forEach((sub, idx) => {
        const score = parseFloat(subjectValues[idx] || '0');
        scores[sub] = score;
        obtained += score;
      });

      const total = SUBJECT_LIST.length * 100; // Assuming 100 per subject

      results.push({
        studentId: parts[0],
        semester: (parseInt(parts[1]) === 1 || parseInt(parts[1]) === 2) ? parseInt(parts[1]) as 1 | 2 : 1,
        scores: scores as Record<Subject, number>,
        totalMarks: total,
        obtainedMarks: obtained,
        percentage: (obtained / total) * 100
      });
    }
  }
  return results;
};
