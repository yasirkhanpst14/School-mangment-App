import React, { useState, useMemo } from 'react';
import { Student, GradeLevel } from '../types';
import { Search, Download, Eye, GraduationCap } from 'lucide-react';
import { utils, writeFile } from 'xlsx';

interface StudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const StudentList: React.FC<StudentListProps> = ({ students, onSelectStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<GradeLevel | 'All'>('All');

  const filteredStudents = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return students.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(term) || 
        student.regNo.toLowerCase().includes(term) ||
        student.fatherName.toLowerCase().includes(term) ||
        (student.formB && student.formB.toLowerCase().includes(term));

      const matchesGrade = gradeFilter === 'All' || student.grade === gradeFilter;
      return matchesSearch && matchesGrade;
    });
  }, [students, searchTerm, gradeFilter]);

  const handleExport = () => {
    const ws = utils.json_to_sheet(filteredStudents.map((s, index) => ({
      'S.No': index + 1,
      'Registration No': s.regNo,
      'Name': s.name,
      'Father Name': s.fatherName,
      'Date of Birth': s.dateOfBirth || 'N/A',
      'Contact': s.contactNumber,
      'Form B': s.formB || 'N/A',
      'Class': s.grade
    })));
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Students");
    writeFile(wb, "Student_Profiles_GPS_Bazar.xlsx");
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Student Directory</h2>
          <p className="text-gray-500 text-sm">Manage student profiles and academic records.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Download className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Name, Father Name, Reg No..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer bg-white"
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value === 'All' ? 'All' : parseInt(e.target.value) as GradeLevel)}
          >
            <option value="All">All Grades</option>
            <option value="1">Grade 1</option>
            <option value="2">Grade 2</option>
            <option value="3">Grade 3</option>
            <option value="4">Grade 4</option>
            <option value="5">Grade 5</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px] md:min-w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th className="px-4 py-3 w-16">S.No</th>
              <th className="px-4 py-3">Reg No</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Father Name</th>
              <th className="px-4 py-3">Date of Birth</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Form B</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr key={student.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">{student.regNo}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={student.pictureUrl} 
                        alt={student.name} 
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <span className="font-medium text-gray-900 block">{student.name}</span>
                        <span className="text-xs text-indigo-600">Grade {student.grade}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{student.fatherName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{student.dateOfBirth || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{student.contactNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">{student.formB || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onSelectStudent(student)}
                      className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                      <Eye className="w-3 h-3" /> View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  <GraduationCap className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  No students found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
