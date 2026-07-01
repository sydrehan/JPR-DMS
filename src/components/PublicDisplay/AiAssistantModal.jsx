import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AiAssistantModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your ResQ AI Assistant. I can help you with emergency guidelines, safety protocols, and details about active weather disasters. Ask me anything!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickQuestions = [
    "What to do in a flood?",
    "How to prepare for a cyclone?",
    "Show emergency contacts",
    "How do I prepare for an earthquake?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) setInput('');

    // Append user message
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          history: messages
        })
      });

      if (!response.ok) throw new Error("Failed to chat with AI");

      const data = await response.json();
      
      // Append assistant response
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I am experiencing connection issues. Please check your safety guidelines locally.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg h-[600px] flex flex-col shadow-2xl relative overflow-hidden transition-colors duration-300"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="/resq_assistant.png" 
                  alt="ResQ Mascot" 
                  className="w-10 h-10 rounded-full bg-slate-800 object-contain p-1 border border-slate-700" 
                  onError={(e) => { e.target.src = 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/bot.svg'; }}
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold flex items-center gap-1.5 text-sm md:text-base">
                  ResQ AI Assistant <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </h3>
                <span className="text-[10px] text-slate-400">Powered by Gemini 2.5 Flash</span>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50 dark:bg-slate-950/40">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-sm">
                    <Bot className="w-4 h-4 text-blue-500" />
                  </div>
                )}
                <div 
                  className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'}`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4 text-blue-500 animate-pulse" />
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm flex items-center gap-1.5 py-4 px-5">
                  <span className="w-2.5 h-2.5 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2.5 h-2.5 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2.5 h-2.5 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Suggestions */}
          {messages.length === 1 && (
            <div className="p-3 bg-slate-50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 justify-center">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 transition-colors shadow-sm cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Footer Input */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <input
              type="text"
              placeholder="Ask for safety guidelines..."
              className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-lg shadow-blue-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
