import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { parseStudentCSV, parseResultCSV, saveStudent, saveResult } from '../services/dataService';

export const DataUpload: React.FC = () => {
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'student' | 'result') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        if (type === 'student') {
          const students = parseStudentCSV(text);
          if (students.length === 0) throw new Error("No valid student records found.");
          students.forEach(saveStudent);
          setStatus({ type: 'success', message: `Successfully imported ${students.length} student profiles.` });
        } else {
          const results = parseResultCSV(text);
          if (results.length === 0) throw new Error("No valid result records found.");
          results.forEach(saveResult);
          setStatus({ type: 'success', message: `Successfully imported ${results.length} exam results.` });
        }
      } catch (err) {
        setStatus({ type: 'error', message: 'Failed to parse CSV. Please check the format.' });
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Data Import Center</h2>
        <p className="text-gray-500 mb-8">Upload CSV files to bulk update the school database.</p>

        {status.message && (
          <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {status.message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Student Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors group">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <UsersIcon />
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">Upload Students</h3>
            <p className="text-sm text-gray-500 mb-6">Format: Name, Father, Contact, Class, RegNo, DOB, FormB</p>
            
            <label className="inline-block">
              <input type="file" accept=".csv" className="hidden" onChange={(e) => handleFileUpload(e, 'student')} />
              <span className="cursor-pointer px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium">
                Select CSV File
              </span>
            </label>
          </div>

          {/* Result Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors group">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">Upload Results</h3>
            <p className="text-sm text-gray-500 mb-6">Format: RegNo, Semester, English, Urdu, Math...</p>
            
            <label className="inline-block">
              <input type="file" accept=".csv" className="hidden" onChange={(e) => handleFileUpload(e, 'result')} />
              <span className="cursor-pointer px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                Select CSV File
              </span>
            </label>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p className="font-semibold mb-2">CSV Formatting Instructions:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Students:</strong> Header row required. Columns: <code>Name, FatherName, Contact, Class, RegNo, DateOfBirth (YYYY-MM-DD), FormB</code></li>
            <li><strong>Results:</strong> Header row required. Columns: <code>RegNo, Semester, English, Urdu, Math, Science, Pashto, SocialStudy, Islamiyat, Nazira, Drawing</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
