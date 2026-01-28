import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Trophy, Target, Award, Star, Zap } from 'lucide-react';
import SidebarPrimary from '../components/SidebarPrimary';
import Navbar from '../components/Navbar';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DashboardPrimaria = () => {
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState(5);
  const [badges, setBadges] = useState(3);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await axios.get(`${API}/projects`);
      setProjects(response.data.filter(p => p.educationLevel === 'primario'));
    } catch (error) {
      console.error('Error cargando proyectos:', error);
    }
  };

  const metrics = [
    {
      label: 'Misiones Completadas',
      value: projects.length,
      icon: Target,
      color: 'bg-gradient-to-br from-green-400 to-green-600',
      emoji: '🎯'
    },
    {
      label: 'Logros Desbloqueados',
      value: achievements,
      icon: Trophy,
      color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      emoji: '🏆'
    },
    {
      label: 'Insignias Obtenidas',
      value: badges,
      icon: Award,
      color: 'bg-gradient-to-br from-purple-400 to-pink-500',
      emoji: '🎖️'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <SidebarPrimary />
      
      <div className="flex-1 ml-64">
        <Navbar projectName="Mi Aventura Estadística" educationLevel="primario" />
        
        <div className="p-8">
          {/* Welcome Hero */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 mb-8 text-white shadow-2xl" data-testid="welcome-hero">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-heading font-black mb-3 flex items-center gap-3">
                  <span>¡Hola Explorador!</span>
                  <span className="text-6xl">👋</span>
                </h1>
                <p className="text-2xl font-accent text-white/90 mb-4">
                  ¡Bienvenido a tu aventura con los datos!
                </p>
                <Link to="/misiones">
                  <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2">
                    <Zap className="w-6 h-6" />
                    ¡Comenzar Nueva Misión!
                  </button>
                </Link>
              </div>
              <div className="text-9xl">
                🚀
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className={`${metric.color} rounded-3xl p-8 text-white shadow-xl hover:scale-105 transition-transform`}
                data-testid={`metric-${metric.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-6xl">{metric.emoji}</div>
                  <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
                </div>
                <div className="text-6xl font-black mb-2">{metric.value}</div>
                <div className="text-lg font-bold opacity-90">{metric.label}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/misiones">
              <div className="bg-white rounded-3xl p-8 border-4 border-blue-200 hover:border-blue-400 transition-all hover:scale-105 cursor-pointer" data-testid="quick-action-missions">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-heading font-bold text-blue-900 mb-2">Mis Misiones</h3>
                <p className="text-gray-600 text-lg">Completa proyectos y gana puntos</p>
              </div>
            </Link>

            <Link to="/juegos">
              <div className="bg-white rounded-3xl p-8 border-4 border-purple-200 hover:border-purple-400 transition-all hover:scale-105 cursor-pointer" data-testid="quick-action-games">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-2xl font-heading font-bold text-purple-900 mb-2">Juegos</h3>
                <p className="text-gray-600 text-lg">Aprende jugando con estadística</p>
              </div>
            </Link>

            <Link to="/profe-marce">
              <div className="bg-white rounded-3xl p-8 border-4 border-pink-200 hover:border-pink-400 transition-all hover:scale-105 cursor-pointer" data-testid="quick-action-chat">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-2xl font-heading font-bold text-pink-900 mb-2">Profe Marce</h3>
                <p className="text-gray-600 text-lg">Pregunta lo que quieras</p>
              </div>
            </Link>

            <Link to="/logros">
              <div className="bg-white rounded-3xl p-8 border-4 border-yellow-200 hover:border-yellow-400 transition-all hover:scale-105 cursor-pointer" data-testid="quick-action-achievements">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl font-heading font-bold text-yellow-900 mb-2">Mis Logros</h3>
                <p className="text-gray-600 text-lg">Ver tus insignias y trofeos</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPrimaria;