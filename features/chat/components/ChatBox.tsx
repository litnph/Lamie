
import React, { useState, useRef, useEffect } from 'react';
import { ChatService, ChatMessage } from '../chat.service';

export const ChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: '0', text: 'Hi, how can Lamie help you today?', sender: 'support', timestamp: Date.now() }]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { isOpen && ChatService.connect(); }, [isOpen]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), text: input, sender: 'user', timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const reply = await ChatService.sendMessage(userMsg.text);
    setMessages(prev => [...prev, reply]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <div className={`bg-white rounded-lg shadow-2xl border border-cream-200 w-80 md:w-96 transition-all duration-300 origin-bottom-right flex flex-col ${isOpen ? 'h-[450px] mb-4 scale-100 opacity-100' : 'h-0 scale-95 opacity-0 overflow-hidden'}`}>
        <div className="bg-mocha-800 p-4 text-cream-100 font-serif flex justify-between">
          <span>Lamie Support</span>
          <button onClick={() => setIsOpen(false)}>×</button>
        </div>
        <div className="flex-grow overflow-y-auto p-4 bg-cream-50 space-y-3">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-2 rounded-lg text-sm max-w-[85%] ${m.sender === 'user' ? 'bg-mocha-800 text-white' : 'bg-white border text-mocha-800'}`}>{m.text}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <form onSubmit={send} className="p-3 border-t flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." className="flex-grow px-2 py-1 text-sm outline-none bg-transparent" />
          <button type="submit" className="bg-mocha-800 text-white px-3 py-1 rounded">➔</button>
        </form>
      </div>
      <button onClick={() => setIsOpen(!isOpen)} className="bg-mocha-800 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </button>
    </div>
  );
};
