import React from 'react';
import { Student, SemesterResult } from '../types';
import { Users, BookOpen, Trophy, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  students: Student[];
  results: SemesterResult[];
}

export const Dashboard: React.FC<DashboardProps> = ({ students, results }) => {
  const totalStudents = students.length;
  
  // Calculate average percentage across all results
  const avgPercentage = results.length > 0
    ? (results.reduce((acc, curr) => acc + curr.percentage, 0) / results.length).toFixed(1)
    : 0;

  // Grade distribution for Pie Chart
  const gradeDistribution = [1, 2, 3, 4, 5].map(grade => ({
    name: `Grade ${grade}`,
    value: students.filter(s => s.grade === grade).length
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Top Performers (simplified logic)
  const topPerformers = results
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3)
    .map(r => {
      const student = students.find(s => s.regNo === r.studentId);
      return { ...r, name: student?.name || 'Unknown' };
    });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">School Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg Performance</p>
            <p className="text-2xl font-bold text-gray-900">{avgPercentage}%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Semesters</p>
            <p className="text-2xl font-bold text-gray-900">2</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Needs Attention</p>
            <p className="text-2xl font-bold text-gray-900">
               {results.filter(r => r.percentage < 40).length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Students per Grade</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-sm text-gray-600 mt-4 flex-wrap">
            {gradeDistribution.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span>{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Students */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Top Performers (Recent)</h3>
          <div className="space-y-4">
            {topPerformers.length > 0 ? topPerformers.map((student, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold">
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">Semester {student.semester}</p>
                  </div>
                </div>
                <div className="font-bold text-indigo-600">{student.percentage.toFixed(1)}%</div>
              </div>
            )) : (
                <p className="text-gray-500 text-sm">No results available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
