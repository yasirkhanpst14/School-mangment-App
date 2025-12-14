import React, { useState } from 'react';
import { StudentFullProfile, SemesterResult, Subject } from '../types';
import { generateStudentReport } from '../services/geminiService';
import { ArrowLeft, Brain, User, Calendar, Phone, Hash, Award, CreditCard, Cake } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { utils, writeFile } from 'xlsx';

interface StudentProfileProps {
  student: StudentFullProfile;
  onBack: () => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ student, onBack }) => {
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleGenerateReport = async () => {
    setLoadingAi(true);
    const report = await generateStudentReport(student);
    setAiReport(report);
    setLoadingAi(false);
  };

  const handleDownloadProfile = () => {
      const profileData = [{
          'Name': student.name,
          'Registration No': student.regNo,
          'Father Name': student.fatherName,
          'Grade': student.grade,
          'Contact': student.contactNumber,
          'Date of Birth': student.dateOfBirth || 'N/A',
          'Form B': student.formB || 'N/A'
      }];

      const resultsData = student.results.map(r => ({
          'Semester': r.semester,
          'Total Marks': r.totalMarks,
          'Obtained Marks': r.obtainedMarks,
          'Percentage': `${r.percentage.toFixed(2)}%`,
          ...r.scores
      }));

      const wb = utils.book_new();
      const wsProfile = utils.json_to_sheet(profileData);
      const wsResults = utils.json_to_sheet(resultsData);

      utils.book_append_sheet(wb, wsProfile, "Profile");
      utils.book_append_sheet(wb, wsResults, "Results");
      
      writeFile(wb, `${student.name.replace(/\s+/g, '_')}_Profile.xlsx`);
  };

  // Prepare chart data
  const sem1 = student.results.find(r => r.semester === 1);
  const sem2 = student.results.find(r => r.semester === 2);

  const comparisonData = Object.values(Subject).map(subject => ({
    name: subject,
    Semester1: sem1?.scores[subject] || 0,
    Semester2: sem2?.scores[subject] || 0,
  }));

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex justify-between items-center">
        <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors"
        >
            <ArrowLeft className="w-4 h-4" /> Back to List
        </button>
        <button
            onClick={handleDownloadProfile}
            className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition font-medium"
        >
            Download Profile
        </button>
      </div>

      {/* Header Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-24 md:h-32 bg-indigo-900 relative">
            <div className="absolute -bottom-12 md:-bottom-16 left-1/2 md:left-8 transform -translate-x-1/2 md:translate-x-0">
                <img 
                    src={student.pictureUrl} 
                    alt={student.name} 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md object-cover bg-gray-100"
                />
            </div>
        </div>
        <div className="pt-14 md:pt-20 pb-6 px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 md:mt-0">{student.name}</h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 mt-4 text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-500" />
                            <span>{student.fatherName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-indigo-500" />
                            <span>{student.regNo}</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-500" />
                            <span>Class {student.grade}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-indigo-500" />
                            <span>{student.contactNumber}</span>
                        </div>
                        {student.dateOfBirth && (
                            <div className="flex items-center gap-2">
                                <Cake className="w-4 h-4 text-indigo-500" />
                                <span>{student.dateOfBirth}</span>
                            </div>
                        )}
                        {student.formB && (
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-indigo-500" />
                                <span>Form B: {student.formB}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-4 md:mt-0">
                    <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                        <span className="block text-xs text-indigo-500 uppercase font-bold tracking-wider">Overall Perf.</span>
                        <span className="text-xl md:text-2xl font-bold text-indigo-700">
                           {student.results.length > 0 
                             ? (student.results.reduce((acc, curr) => acc + curr.percentage, 0) / student.results.length).toFixed(1) 
                             : 'N/A'}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results Tables */}
        <div className="lg:col-span-2 space-y-6">
             {student.results.sort((a,b) => a.semester - b.semester).map((result) => (
                <div key={result.semester} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Award className="w-5 h-5 text-yellow-500" /> Semester {result.semester}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${result.percentage >= 50 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {result.percentage.toFixed(2)}%
                        </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                        {Object.entries(result.scores).map(([subject, score]) => (
                            <div key={subject} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 md:p-3 bg-gray-50 rounded-lg">
                                <span className="text-xs md:text-sm font-medium text-gray-600 mb-1 sm:mb-0">{subject}</span>
                                <span className="font-bold text-gray-900">{score}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-600">
                        <span>Total Marks: {result.totalMarks}</span>
                        <span>Obtained: {result.obtainedMarks}</span>
                    </div>
                </div>
             ))}
             {student.results.length === 0 && (
                 <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
                     No exam results uploaded yet.
                 </div>
             )}
        </div>

        {/* Charts & AI */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Performance Comparison</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} tick={{fontSize: 10}} interval={0} />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Semester1" fill="#4f46e5" name="Sem 1" />
                            <Bar dataKey="Semester2" fill="#10b981" name="Sem 2" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-6 h-6 text-indigo-200" />
                    <h3 className="text-lg font-bold">AI Performance Insight</h3>
                </div>
                
                {aiReport ? (
                    <div className="bg-white/10 p-4 rounded-lg text-sm leading-relaxed backdrop-blur-sm">
                        <p>{aiReport}</p>
                        <button onClick={() => setAiReport(null)} className="mt-3 text-xs text-indigo-200 hover:text-white underline">Clear</button>
                    </div>
                ) : (
                    <div className="text-center py-4">
                         <p className="text-sm text-indigo-200 mb-4">Generate a personalized report card comment based on exam scores using Gemini AI.</p>
                         <button 
                            onClick={handleGenerateReport}
                            disabled={loadingAi}
                            className="w-full py-2 bg-white text-indigo-700 font-bold rounded-lg hover:bg-indigo-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {loadingAi ? 'Analyzing...' : 'Generate AI Report'}
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
