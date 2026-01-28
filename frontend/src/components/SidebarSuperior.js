import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  FolderKanban,
  Upload,
  BarChart3,
  Calculator,
  FileText,
  Download,
  MessageCircle,
  ArrowLeft,
  Gamepad2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SidebarSuperior = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/dashboard-superior' },
    { icon: FolderKanban, label: 'Proyectos', path: '/proyectos-superior' },
    { icon: Upload, label: 'Cargar Datos', path: '/carga-datos-superior' },
    { icon: BarChart3, label: 'Gráficos', path: '/graficos-superior' },
    { icon: Calculator, label: 'Análisis', path: '/analisis-superior' },
    { icon: FileText, label: 'Reportes IA', path: '/reportes-superior' },
    { icon: MessageCircle, label: 'Profe Marce', path: '/profe-marce-superior' },
    { icon: Gamepad2, label: 'Actividades', path: '/actividades-superior' },
    { icon: Download, label: 'Descargar', path: '/descargar-superior' }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-emerald-600 via-teal-700 to-cyan-800 shadow-2xl z-50 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <Link to="/" className="block">
          <img src="/logo.png" alt="EstadísticaMente" className="w-full h-auto max-h-16 object-contain" />
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              data-testid={`sidebar-superior-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                isActive
                  ? 'bg-white text-emerald-700 font-bold shadow-lg'
                  : 'text-emerald-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Volver al Inicio */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          data-testid="back-to-home-button-superior"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-100 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Volver al Inicio</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarSuperior;
