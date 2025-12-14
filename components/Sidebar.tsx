import React from 'react';
import { LayoutDashboard, Users, Upload, School, X } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'upload', label: 'Data Upload', icon: Upload },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-indigo-900 text-white shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-6 flex items-center justify-between border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <School className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="font-bold text-lg leading-tight">GPS No 1</h1>
              <p className="text-xs text-indigo-300">Bazar Campus</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-indigo-300 hover:text-white p-1 rounded-md hover:bg-indigo-800 transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                onClose(); // Close sidebar on mobile when item selected
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                currentView === item.id 
                  ? 'bg-indigo-700 text-white shadow-md' 
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-800">
          <div className="text-xs text-indigo-400 text-center">
            &copy; 2024 School Management
          </div>
        </div>
      </div>
    </>
  );
};
