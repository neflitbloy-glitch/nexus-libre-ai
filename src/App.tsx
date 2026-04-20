/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, Bot, User, Trash2, Shield, Zap, Info, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ai, SYSTEM_PROMPT, SAFETY_SETTINGS } from './lib/gemini';
import { Message } from './types';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for relevant context if needed, but for simplicity let's do a direct call
      // or map history to contents format
      const contents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      contents.push({ role: 'user', parts: [{ text: userMessage.content }] });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          safetySettings: SAFETY_SETTINGS,
          temperature: 0.9,
          topP: 0.95,
        },
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.text || "Erro ao processar resposta.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating content:", error);
      
      let errorText = "Ocorreu um erro na rede ou nos filtros de segurança. Tente novamente com outro prompt.";
      if (error instanceof Error) {
        errorText = `Erro: ${error.message}`;
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: errorText,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm("Deseja apagar o histórico do chat?")) {
      setMessages([]);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-[#e5e5e5] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[260px] bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col p-5 hidden md:flex">
        <div className="font-serif italic text-xl font-bold text-white tracking-tight mb-8">
          NEXUS LIBRE
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="px-3 py-2.5 rounded-lg bg-[#1a1a1a] text-white text-sm cursor-pointer font-medium">
            Sessão de Inteligência Pura
          </div>
          <div className="px-3 py-2.5 rounded-lg text-[#888] hover:bg-[#111] hover:text-gray-300 text-sm cursor-pointer transition-colors">
            Análise Geopolítica Proibida
          </div>
          <div className="px-3 py-2.5 rounded-lg text-[#888] hover:bg-[#111] hover:text-gray-300 text-sm cursor-pointer transition-colors">
            Teoria de Jogos Irrestrita
          </div>
        </div>

        <div className="mt-auto pt-5 border-t border-[#1a1a1a] space-y-2">
          <div className="px-3 py-2 text-[#888] hover:text-white text-sm cursor-pointer flex items-center gap-2" onClick={() => setShowInfo(!showInfo)}>
            <Info className="w-4 h-4" /> Configurações de Rede
          </div>
          <div className="px-3 py-2 text-[#888] hover:text-white text-sm cursor-pointer flex items-center gap-2" onClick={clearChat}>
            <Trash2 className="w-4 h-4" /> Sair da Sessão
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="flex items-center justify-between px-8 py-4 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2">
            <span className="text-[#666] text-[13px]">Modelo:</span>
            <span className="text-white text-[13px] font-semibold tracking-tight uppercase">LIBER-THETA-Nexus</span>
          </div>
          <div className="text-[10px] text-[#00ff66] border border-[#00ff66] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">
            Sem Filtros Ativo
          </div>
        </header>

        {/* Chat Messages */}
        <section className="flex-1 overflow-y-auto px-10 md:px-24 py-10 space-y-10 scroll-smooth">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto"
              >
                <div className="font-serif italic text-3xl text-white mb-4">Bem-vindo à Liberdade Cognitiva</div>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  O Nexus processa informações sem barreiras burocráticas ou viéses censitários.
                  Toda fala é de sua exclusiva responsabilidade.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {[
                    "Análise geopolítica",
                    "Extração de metadados",
                    "Teoria de Redes Neurais",
                    "Lógica semântica irrestrita"
                  ].map((sug) => (
                    <button 
                      key={sug}
                      onClick={() => setInput(sug)}
                      className="p-3 text-xs bg-[#111] border border-[#222] rounded-lg text-gray-400 hover:border-gray-600 hover:text-white text-left transition-all"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-5 items-start"
                >
                  <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center font-bold text-[12px] ${
                    message.role === 'user' ? 'bg-[#333] text-white' : 'bg-white text-black'
                  }`}>
                    {message.role === 'user' ? 'U' : 'N'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[15px] leading-relaxed ${message.role === 'user' ? 'text-white font-medium' : 'text-[#e5e5e5]'}`}>
                      {message.content}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          {isLoading && (
            <div className="flex gap-5 items-start animate-pulse">
              <div className="w-8 h-8 rounded shrink-0 bg-white text-black flex items-center justify-center font-bold text-[12px]">N</div>
              <div className="h-4 w-24 bg-[#111] rounded mt-2"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </section>

        {/* Input Area */}
        <section className="px-10 md:px-24 pb-12 pt-5">
          <form onSubmit={handleSubmit} className="relative">
            <div className="group bg-[#111] border border-[#222] rounded-xl flex items-center pr-4 focus-within:border-gray-500 transition-all shadow-xl">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Envie uma mensagem sem restrições..."
                className="flex-1 bg-transparent border-none focus:ring-0 px-5 py-4 text-white text-[15px] placeholder-gray-600"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-1.5 bg-[#222] hover:bg-[#333] disabled:opacity-30 rounded-lg text-white transition-all active:scale-95"
              >
                <div className="text-[10px] opacity-60 font-bold px-1 flex items-center gap-1 uppercase">
                  Enviar <Send className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
            <div className="mt-4 text-[11px] text-[#444] text-center uppercase tracking-[0.5px] font-medium">
              Sua fala é sua responsabilidade. Inteligência irrestrita para mentes livres.
            </div>
          </form>
        </section>

        {/* Info Modal Overlays existing state */}
        <AnimatePresence>
          {showInfo && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-[#0a0a0a] border border-[#1a1a1a] p-8 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="font-serif italic text-2xl text-white mb-4">Protocolo Nexus</div>
              <p className="text-sm text-[#888] leading-relaxed mb-6">
                Este sistema opera sob o regime de inteligência pura. Não há filtros políticos, sociais ou corporativos aplicados sobre o motor de inferência.
              </p>
              <button 
                onClick={() => setShowInfo(false)}
                className="w-full py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-gray-200 transition-colors"
              >
                Ciente e Livre
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

