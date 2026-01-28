import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Loader2, RefreshCw, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import SidebarSuperior from '../components/SidebarSuperior';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ReportesSuperior = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [currentProject, setCurrentProject] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadProjects();
    const currentProjectId = localStorage.getItem('currentProjectId');
    if (currentProjectId) setSelectedProject(currentProjectId);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadProjectDetails(selectedProject);
      loadDatasets(selectedProject);
      loadExistingReport(selectedProject);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    try {
      const response = await axios.get(`${API}/projects`);
      setProjects(response.data.filter(p => p.educationLevel === 'superior'));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const loadProjectDetails = async (projectId) => {
    try {
      const response = await axios.get(`${API}/projects/${projectId}`);
      setCurrentProject(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const loadDatasets = async (projectId) => {
    try {
      const response = await axios.get(`${API}/datasets/${projectId}`);
      setDatasets(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const loadExistingReport = async (projectId) => {
    try {
      const response = await axios.get(`${API}/reports/${projectId}`);
      if (response.data.length > 0) {
        setReport(response.data[response.data.length - 1].content);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const generateReport = async () => {
    if (!selectedProject) {
      toast.error('Seleccioná un proyecto primero');
      return;
    }
    if (datasets.length === 0) {
      toast.error('El proyecto no tiene datos cargados');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/reports/generate`, null, {
        params: { project_id: selectedProject, education_level: 'superior' }
      });
      if (response.data.report) {
        setReport(response.data.report);
        toast.success('Reporte generado exitosamente');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      toast.success('Copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Error al copiar');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <SidebarSuperior />
      
      <div className="flex-1 ml-64">
        <Navbar projectName={currentProject?.name || 'Reportes IA'} educationLevel="superior" />
        
        <div className="p-6">
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 mb-6 text-white shadow-xl">
            <h1 className="text-3xl font-heading font-bold mb-2 flex items-center gap-3">
              <FileText className="w-8 h-8" />
              Reportes con Inteligencia Artificial
            </h1>
            <p className="text-emerald-100">
              Informes académicos completos con análisis e interpretación de resultados
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-6 border border-emerald-100 shadow-sm">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label className="text-sm font-bold mb-2 block">Proyecto</Label>
                <Select value={selectedProject} onValueChange={(v) => { setSelectedProject(v); localStorage.setItem('currentProjectId', v); setReport(''); }}>
                  <SelectTrigger><SelectValue placeholder="Seleccioná proyecto" /></SelectTrigger>
                  <SelectContent>
                    {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={generateReport} disabled={loading || !selectedProject} className="bg-emerald-600 hover:bg-emerald-700">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generando...</> : <><RefreshCw className="w-4 h-4 mr-2" />Generar Reporte</>}
              </Button>

              {report && (
                <Button onClick={copyToClipboard} variant="outline" className="border-emerald-300 text-emerald-700">
                  {copied ? <><Check className="w-4 h-4 mr-2" />Copiado</> : <><Copy className="w-4 h-4 mr-2" />Copiar</>}
                </Button>
              )}
            </div>

            {datasets.length > 0 && (
              <div className="mt-4 p-3 bg-emerald-50 rounded-xl text-sm text-emerald-800">
                <strong>Datos:</strong> {datasets[0]?.variables?.length || 0} variable(s), {datasets[0]?.rawData?.length || 0} registros
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100">
              <h2 className="text-xl font-bold text-emerald-900">📄 Informe Estadístico Académico</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
                  <p className="text-gray-600">Analizando datos y generando informe académico...</p>
                </div>
              ) : report ? (
                <div className="prose prose-emerald max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-emerald-900 mb-4" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-bold text-emerald-800 mb-3 mt-6" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-bold text-emerald-700 mb-2 mt-4" {...props} />,
                      p: ({node, ...props}) => <p className="text-gray-700 mb-4 leading-relaxed" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-emerald-900" {...props} />,
                      code: ({node, inline, ...props}) => 
                        inline ? <code className="bg-emerald-100 text-emerald-800 px-1 rounded text-sm" {...props} />
                        : <code className="block bg-gray-100 p-4 rounded-lg overflow-x-auto" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-emerald-400 pl-4 italic text-gray-600 my-4" {...props} />
                    }}
                  >
                    {report}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Sin reporte generado</h3>
                  <p className="text-gray-500">Seleccioná un proyecto y generá el reporte</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesSuperior;
