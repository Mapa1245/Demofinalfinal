import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Send, Loader2, Trash2, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import SidebarSuperior from '../components/SidebarSuperior';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProfeMarceSuperior = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `superior_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `Bienvenido/a al asistente de estadística de nivel superior. Soy la **Profe Marce** y estoy aquí para ayudarte con conceptos avanzados de estadística.

Puedo asistirte con:
- **Estadística descriptiva e inferencial**
- **Pruebas de hipótesis** (t-test, chi-cuadrado, ANOVA)
- **Regresión y correlación**
- **Distribuciones de probabilidad**
- **Intervalos de confianza**
- **Diseño experimental**
- **Interpretación de resultados**

Utilizaré notación matemática formal ($\\LaTeX$) cuando sea necesario para mayor claridad. ¿En qué puedo ayudarte?`
    }]);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        message: inputMessage,
        sessionId: sessionId,
        educationLevel: 'superior'
      });
      if (response.data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al enviar mensaje');
      setMessages(prev => [...prev, { role: 'assistant', content: 'Disculpá, hubo un error al procesar tu consulta. Por favor, intentá nuevamente.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: '¡Chat reiniciado! ¿En qué puedo ayudarte?' }]);
  };

  const suggestedQuestions = [
    '¿Cómo interpreto el coeficiente de correlación de Pearson?',
    'Explicame la diferencia entre varianza poblacional y muestral',
    '¿Cuándo uso una prueba t y cuándo ANOVA?',
    '¿Cómo construyo un intervalo de confianza para la media?',
    '¿Qué indica el coeficiente de determinación R²?'
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <SidebarSuperior />
      
      <div className="flex-1 ml-64 flex flex-col h-screen">
        <Navbar projectName="Profe Marce" educationLevel="superior" />
        
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-4 mb-4 text-white shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                <span className="text-3xl">👩‍🏫</span>
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold">Profe Marce - Nivel Superior</h1>
                <p className="text-emerald-200 text-sm">Asistente de estadística avanzada</p>
              </div>
            </div>
            <Button onClick={clearChat} variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Trash2 className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          </div>

          <div className="flex-1 bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-emerald-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                  }`}>
                    {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <span className="text-lg">👩‍🏫</span>}
                  </div>
                  
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-gray-800'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-emerald-900" {...props} />,
                            code: ({node, inline, ...props}) => 
                              inline ? <code className="bg-emerald-200 text-emerald-900 px-1 rounded text-sm" {...props} />
                              : <code className="block bg-gray-800 text-gray-100 p-3 rounded-lg overflow-x-auto text-sm" {...props} />
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <span className="text-lg">👩‍🏫</span>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                      <span className="text-gray-600">Analizando...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 2 && (
              <div className="px-4 py-3 border-t border-emerald-100 bg-emerald-50/50">
                <p className="text-xs text-gray-500 mb-2">Preguntas sugeridas:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputMessage(q)}
                      className="text-xs bg-white border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-100"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-t border-emerald-100 bg-white">
              <div className="flex gap-3">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribí tu consulta sobre estadística..."
                  className="flex-1 resize-none min-h-[50px] max-h-[150px]"
                  disabled={loading}
                />
                <Button onClick={sendMessage} disabled={loading || !inputMessage.trim()} className="bg-emerald-600 hover:bg-emerald-700 px-6">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">Enter para enviar • Shift + Enter para nueva línea</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfeMarceSuperior;
