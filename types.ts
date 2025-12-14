export type GradeLevel = 1 | 2 | 3 | 4 | 5;

export enum Subject {
  ENGLISH = 'English',
  URDU = 'Urdu',
  MATH = 'Math',
  G_SCIENCE = 'G. Science',
  PASHTO = 'Pashto',
  SOCIAL_STUDY = 'Social Study',
  ISLAMIYAT = 'Islamiyat',
  NAZIRA_QURAN = 'Nazira Quran',
  DRAWING = 'Drawing'
}

export const SUBJECT_LIST = [
  Subject.ENGLISH,
  Subject.URDU,
  Subject.MATH,
  Subject.G_SCIENCE,
  Subject.PASHTO,
  Subject.SOCIAL_STUDY,
  Subject.ISLAMIYAT,
  Subject.NAZIRA_QURAN,
  Subject.DRAWING
];

export interface Student {
  id: string;
  regNo: string;
  name: string;
  fatherName: string;
  contactNumber: string;
  grade: GradeLevel;
  pictureUrl: string;
  dateOfBirth?: string;
  formB?: string;
}

export interface SemesterResult {
  studentId: string; // Links to regNo
  semester: 1 | 2;
  scores: Record<Subject, number>;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
}

export interface StudentFullProfile extends Student {
  results: SemesterResult[];
}
