import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Send, Sparkles, MessageCircle, Trash2 } from 'lucide-react';
import SidebarPrimary from '../components/SidebarPrimary';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { trackQuestionAsked } from '../utils/achievementTracker';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProfeMarcePrimaria = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola amiguito! 👋 Soy Profe Marce, tu ayudante de estadística. ¿Qué querés saber hoy? ¡Preguntame lo que quieras! 😊',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(`primario_${Date.now()}`);

  const suggestedQuestions = [
    '¿Qué es un promedio?',
    '¿Qué significa la moda?',
    '¿Para qué sirven los gráficos?',
    '¿Cómo se hace un gráfico de barras?',
    '¿Qué es la mediana?'
  ];

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        message: messageText,
        sessionId: sessionId,
        educationLevel: 'primario'
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Track for achievements
      trackQuestionAsked();
    } catch (error) {
      console.error('Error:', error);
      toast.error('¡Ups! Algo salió mal. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: '¡Hola de nuevo! 👋 ¿En qué te puedo ayudar? 😊',
        timestamp: new Date()
      }
    ]);
    toast.success('Chat limpiado');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <SidebarPrimary />
      
      <div className="flex-1 ml-64">
        <Navbar projectName="Profe Marce" educationLevel="primario" />
        
        <div className="p-6 h-[calc(100vh-64px)] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl p-6 mb-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-6xl">👩‍🏫</div>
                <div>
                  <h1 className="text-4xl font-heading font-black">¡Hola! Soy Profe Marce</h1>
                  <p className="text-xl font-accent">Tu ayudante de estadística - ¡Preguntame lo que quieras!</p>
                </div>
              </div>
              <Button
                onClick={clearChat}
                variant="outline"
                className="border-white text-white hover:bg-white/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpiar Chat
              </Button>
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="mb-4">
            <p className="text-sm font-bold text-gray-600 mb-2">💡 Preguntas sugeridas:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  className="px-4 py-2 bg-white border-2 border-pink-200 rounded-full text-sm font-medium text-pink-700 hover:bg-pink-50 hover:border-pink-400 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 bg-white rounded-3xl border-4 border-pink-200 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-3xl p-4 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-none'
                        : 'bg-purple-50 border-2 border-purple-200 rounded-bl-none'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">👩‍🏫</span>
                        <span className="font-bold text-purple-900">Profe Marce</span>
                      </div>
                    )}
                    <div className={`prose prose-lg max-w-none ${msg.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkMath, remarkGfm]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="text-lg">{msg.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-3xl rounded-bl-none p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👩‍🏫</span>
                      <span className="font-bold text-purple-900">Profe Marce está escribiendo</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t-4 border-pink-100 bg-pink-50">
              <div className="flex gap-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
                  placeholder="Escribí tu pregunta acá..."
                  className="flex-1 text-lg rounded-full border-2 border-pink-300 focus:border-pink-500 py-6"
                  disabled={loading}
                  data-testid="chat-input"
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={loading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full px-8 py-6"
                  data-testid="send-message-btn"
                >
                  <Send className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfeMarcePrimaria;
