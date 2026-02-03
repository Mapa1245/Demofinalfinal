import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';
import SidebarPrimary from '../components/SidebarPrimary';
import Navbar from '../components/Navbar';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { trackChartCreated } from '../utils/achievementTracker';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

const GraficosPrimaria = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [datasets, setDatasets] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const chartTracked = useRef(false);

  const emojiOptions = ['😊', '⭐', '❤️', '🎉', '🏆', '🎯', '🌟', '🔥', '👍', '🎈', '🦄', '🌈'];

  useEffect(() => {
    loadProjects();
    
    // Escuchar cambios de proyecto
    const handleStorageChange = (e) => {
      if (e.key === 'currentProjectId' && e.newValue) {
        setSelectedProject(e.newValue);
        loadDatasets(e.newValue);
      }
    };
    
    const handleProjectChange = (e) => {
      if (e.detail && e.detail !== selectedProject) {
        setSelectedProject(e.detail);
        loadDatasets(e.detail);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('projectChanged', handleProjectChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('projectChanged', handleProjectChange);
    };
  }, []);

  const loadProjects = async () => {
    try {
      const response = await axios.get(`${API}/projects`);
      const primaryProjects = response.data.filter(p => p.educationLevel === 'primario');
      setProjects(primaryProjects);
      
      const currentProjectId = localStorage.getItem('currentProjectId');
      if (currentProjectId && primaryProjects.find(p => p.id === currentProjectId)) {
        setSelectedProject(currentProjectId);
        loadDatasets(currentProjectId);
      } else if (primaryProjects.length > 0) {
        const firstProject = primaryProjects[0].id;
        setSelectedProject(firstProject);
        localStorage.setItem('currentProjectId', firstProject);
        loadDatasets(firstProject);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const loadDatasets = async (projectId) => {
    try {
      const response = await axios.get(`${API}/datasets/${projectId}`);
      setDatasets(response.data);
      if (response.data.length > 0) {
        processDataForChart(response.data[0]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const processDataForChart = (dataset) => {
    if (!dataset || !dataset.variables || dataset.variables.length === 0) return;
    
    const variable = dataset.variables[0];
    const valueCounts = {};
    variable.values.forEach(val => {
      valueCounts[val] = (valueCounts[val] || 0) + 1;
    });

    const processed = Object.entries(valueCounts).map(([name, value]) => ({
      name,
      value,
      cantidad: value
    }));

    setChartData(processed);
    
    // Track chart creation (only once per session per chart)
    if (!chartTracked.current && processed.length > 0) {
      trackChartCreated();
      chartTracked.current = true;
    }
  };

  const handleProjectChange = (projectId) => {
    setSelectedProject(projectId);
    localStorage.setItem('currentProjectId', projectId);
    window.dispatchEvent(new CustomEvent('projectChanged', { detail: projectId }));
    loadDatasets(projectId);
  };

  const renderPictogram = () => {
    return (
      <div className="space-y-4">
        {chartData.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border-4 border-blue-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{item.name}</h3>
            <div className="flex flex-wrap gap-2">
              {Array(item.value).fill(0).map((_, i) => (
                <span key={i} className="text-4xl">
                  {selectedEmoji}
                </span>
              ))}
            </div>
            <p className="text-xl font-bold text-blue-600 mt-3">Total: {item.value}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-xl text-gray-600">¡Ingresá datos para ver tu gráfico!</p>
        </div>
      );
    }

    if (chartType === 'pictogram') {
      return renderPictogram();
    }

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" />
            <XAxis dataKey="name" style={{ fontSize: '16px', fontWeight: 'bold' }} />
            <YAxis style={{ fontSize: '16px', fontWeight: 'bold' }} />
            <Tooltip contentStyle={{ borderRadius: '12px', fontWeight: 'bold', fontSize: '16px' }} />
            <Bar dataKey="cantidad" fill="#3B82F6" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={140}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <SidebarPrimary />
      
      <div className="flex-1 lg:ml-64 w-full">
        <Navbar projectName="Mis Gráficos" educationLevel="primario" />
        
        <div className="p-8">
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 mb-8 text-white shadow-2xl">
            <h1 className="text-5xl font-heading font-black mb-2 flex items-center gap-3">
              <BarChart3 className="w-12 h-12" />
              ¡Mis Gráficos!
            </h1>
            <p className="text-2xl font-accent">Creá gráficos increíbles con tus datos</p>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-3xl p-8 mb-6 border-4 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">⚙️ Configuración</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-lg font-bold mb-2 block">Tipo de Gráfico</Label>
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pictogram">📊 Pictograma</SelectItem>
                    <SelectItem value="bar">📊 Barras</SelectItem>
                    <SelectItem value="pie">🥧 Circular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {projects.length > 0 && (
                <div>
                  <Label className="text-lg font-bold mb-2 block">Misión</Label>
                  <Select value={selectedProject} onValueChange={handleProjectChange}>
                    <SelectTrigger className="text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Emoji Selector for Pictogram */}
            {chartType === 'pictogram' && (
              <div className="mt-6">
                <Label className="text-lg font-bold mb-3 block">Elegí tu Emoji para el Pictograma:</Label>
                <div className="flex flex-wrap gap-3">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`text-5xl p-3 rounded-2xl transition-all hover:scale-110 ${
                        selectedEmoji === emoji
                          ? 'bg-blue-200 border-4 border-blue-500 scale-110'
                          : 'bg-gray-100 border-2 border-gray-300'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chart Display */}
          <div className="bg-white rounded-3xl p-8 border-4 border-purple-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 Tu Gráfico</h2>
            {renderChart()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraficosPrimaria;
