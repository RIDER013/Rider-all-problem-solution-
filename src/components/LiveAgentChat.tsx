import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, ArrowLeft } from 'lucide-react';
import { ChatMessage, PageId } from '../types';

const CHAT_STORAGE_KEY = 'rider_live_agent_chat';

interface LiveAgentChatProps {
  onNavigate: (page: PageId) => void;
}

export const LiveAgentChat: React.FC<LiveAgentChatProps> = ({ onNavigate }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: trimmed,
      timestamp: now,
    };

    const agentAck: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'agent',
      text: 'Thank you for your message. A live support agent has received your request and will reply shortly.',
      timestamp: now,
    };

    const next = [...messages, userMsg, agentAck];
    setMessages(next);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(next));
    setInput('');
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition cursor-pointer mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Chat with Live Agent
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Send a direct message to get live troubleshooting help.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[520px]">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5 bg-slate-50/60 dark:bg-slate-950/60">
          <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Live Agent Support
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-white dark:bg-slate-900">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-slate-400 dark:text-slate-500">
              <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Type your question below to start chatting with a live agent.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 px-1 font-mono-num">
                  {msg.timestamp}
                </span>
              </div>
            ))
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center gap-2.5"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message to live agent..."
            className="flex-1 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send message"
            className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 disabled:opacity-50 text-white text-sm font-semibold inline-flex items-center gap-1.5 transition cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
