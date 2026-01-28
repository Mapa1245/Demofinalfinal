import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, GraduationCap, BookOpen, Users } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const levels = [
    {
      id: 'primario',
      title: 'Nivel Primario',
      icon: '🔵',
      description: 'Aprendé estadística de forma visual y divertida',
      color: 'from-blue-400 to-blue-600',
      features: ['Pictogramas', 'Gráficos simples', 'Entrada por voz'],
      testId: 'primary-level-button'
    },
    {
      id: 'secundario',
      title: 'Nivel Secundario',
      icon: '🟣',
      description: 'Analizá datos con tablas de frecuencia y gráficos',
      color: 'from-purple-400 to-purple-600',
      features: ['Tablas de frecuencia', 'Múltiples gráficos', 'Análisis básico'],
      testId: 'secondary-level-button'
    },
    {
      id: 'superior',
      title: 'Nivel Superior',
      icon: '⚫',
      description: 'Herramientas profesionales de análisis estadístico',
      color: 'from-gray-700 to-gray-900',
      features: ['Análisis avanzado', 'Correlaciones', 'Regresión lineal'],
      testId: 'higher-level-button'
    }
  ];

  const handleLevelSelect = (levelId) => {
    localStorage.setItem('educationLevel', levelId);
    if (levelId === 'primario') {
      navigate('/dashboard-primaria');
    } else if (levelId === 'secundario') {
      navigate('/dashboard-secundario');
    } else if (levelId === 'superior') {
      navigate('/dashboard-superior');
    } else {
      navigate('/dashboard-secundario');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          {/* Logo & Title */}
          <div className="text-center mb-16" data-testid="home-header">
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="EstadísticaMente" className="h-28 w-auto object-contain" />
            </div>
            <p className="text-2xl text-pink-700 font-medium mb-2">
              CRM Analítico Educativo
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pensar con datos, decidir con criterio
            </p>
          </div>

          {/* Level Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleLevelSelect(level.id)}
                data-testid={level.testId}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 transform hover:-translate-y-2 border-2 border-pink-100 hover:border-pink-300"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{level.icon}</div>
                  <h2 className="text-2xl font-heading font-bold text-pink-900 mb-3">
                    {level.title}
                  </h2>
                  <p className="text-gray-600 mb-6">{level.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {level.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className={`inline-block px-8 py-3 rounded-full bg-gradient-to-r ${level.color} text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-shadow`}>
                    Comenzar
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-pink-100">
              <GraduationCap className="w-10 h-10 text-pink-600 mx-auto mb-3" />
              <h3 className="font-bold text-pink-900 mb-2">Aprendé Haciendo</h3>
              <p className="text-sm text-gray-600">Trabajá con datos reales y casos prácticos</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-pink-100">
              <BookOpen className="w-10 h-10 text-pink-600 mx-auto mb-3" />
              <h3 className="font-bold text-pink-900 mb-2">Asistente AI</h3>
              <p className="text-sm text-gray-600">Profe Marce te guía en cada paso</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-pink-100">
              <Users className="w-10 h-10 text-pink-600 mx-auto mb-3" />
              <h3 className="font-bold text-pink-900 mb-2">Para Todos</h3>
              <p className="text-sm text-gray-600">Desde primaria hasta universidad</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;