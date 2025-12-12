import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { getEmotionalSupportResponse } from '../services/geminiService';

interface SupportChatProps {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
}

export const SupportChat: React.FC<SupportChatProps> = ({ messages, addMessage }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };
    addMessage(userMsg);
    setInput('');
    setIsLoading(true);

    try {
      // Format history for Gemini API
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const responseText = await getEmotionalSupportResponse(history, userMsg.text);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "I'm here for you, but I'm having trouble connecting right now.",
        timestamp: new Date()
      };
      addMessage(botMsg);
    } catch (error) {
        const errorMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: "I'm having trouble connecting. Please check your internet or try again later.",
            timestamp: new Date()
        };
        addMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] md:h-[calc(100vh-64px)] -m-4 md:m-0">
      <header className="bg-white p-4 border-b border-gray-100 flex items-center gap-3 shadow-sm z-10">
        <div className="bg-violet-100 p-2 rounded-full">
            <Bot size={24} className="text-violet-600" />
        </div>
        <div>
            <h1 className="text-lg font-bold text-gray-800">Coach Vitality</h1>
            <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Online
            </p>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
                <p>Hello! I'm your personal wellness coach.</p>
                <p className="text-sm mt-2">Tell me how you're feeling or ask for advice.</p>
            </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-emerald-500 text-white' : 'bg-violet-100 text-violet-600'
            }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-500 text-white rounded-tr-none'
                  : 'bg-white text-gray-700 shadow-sm rounded-tl-none border border-gray-100'
              }`}
            >
              {msg.text}
              <div className={`text-[10px] mt-1 opacity-70 ${msg.role === 'user' ? 'text-emerald-100' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                    <Bot size={16} />
                 </div>
                 <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                    <Loader2 size={16} className="animate-spin text-gray-400" />
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-100">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-violet-500 outline-none text-gray-700"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};