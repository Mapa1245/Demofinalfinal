import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ projectName, educationLevel }) => {
  const { user } = useAuth();

  const getLevelBadge = () => {
    const colors = {
      primario: 'bg-blue-100 text-blue-700',
      secundario: 'bg-purple-100 text-purple-700',
      superior: 'bg-gray-800 text-white'
    };

    return (
      <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${colors[educationLevel] || colors.secundario}`}>
        {educationLevel === 'primario' && '🔵 Nivel Primario'}
        {educationLevel === 'secundario' && '🟣 Nivel Secundario'}
        {educationLevel === 'superior' && '⚫ Nivel Superior'}
      </span>
    );
  };

  return (
    <div className="h-16 bg-white border-b border-pink-100 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {projectName && (
          <h2 className="text-xl font-heading font-bold text-pink-900" data-testid="project-name">
            {projectName}
          </h2>
        )}
        {educationLevel && getLevelBadge()}
      </div>

      <div className="flex items-center gap-4">
        <button 
          className="w-10 h-10 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center transition-colors"
          data-testid="notifications-button"
        >
          <Bell className="w-5 h-5 text-pink-600" />
        </button>
        
        <div className="flex items-center gap-3" data-testid="user-profile">
          <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="text-sm">
            <p className="font-bold text-pink-900">{user?.email || 'Usuario'}</p>
            <p className="text-pink-600 text-xs">Estudiante</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;