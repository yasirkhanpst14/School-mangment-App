import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { StudentList } from './components/StudentList';
import { StudentProfile } from './components/StudentProfile';
import { DataUpload } from './components/DataUpload';
import { initData, getStudents, getResults } from './services/dataService';
import { Student, StudentFullProfile } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    initData();
    refreshData();
  }, [currentView]);

  const refreshData = () => {
    setStudents(getStudents());
    setResults(getResults());
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setCurrentView('profile');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard students={students} results={results} />;
      case 'students':
        return <StudentList students={students} onSelectStudent={handleStudentSelect} />;
      case 'upload':
        return <DataUpload />;
      case 'profile':
        if (!selectedStudent) return <Dashboard students={students} results={results} />;
        
        const studentResults = results.filter(r => r.studentId === selectedStudent.regNo);
        const fullProfile: StudentFullProfile = {
            ...selectedStudent,
            results: studentResults
        };
        
        return <StudentProfile student={fullProfile} onBack={() => setCurrentView('students')} />;
      default:
        return <Dashboard students={students} results={results} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-900">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-900 text-white p-4 flex justify-between items-center sticky top-0 z-40 shadow-md">
         <span className="font-bold text-lg">GPS No 1 Bazar</span>
         <button 
           onClick={() => setIsMobileMenuOpen(true)}
           className="p-1 rounded hover:bg-indigo-800 transition"
         >
            <Menu className="w-6 h-6" />
         </button>
      </div>

      <Sidebar 
        currentView={currentView} 
        setView={(view) => {
          setCurrentView(view);
          if (view !== 'profile') setSelectedStudent(null);
        }} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
