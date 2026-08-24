"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Trash2, Mail, Calendar } from "lucide-react";

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
  }

  const deleteMessage = async (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      await supabase.from('messages').delete().eq('id', id);
      fetchMessages();
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto pb-32">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading tracking-widest text-white">MESSAGES</h1>
      </div>

      <div className="space-y-6">
        {messages.map(msg => (
          <div key={msg.id} className="bg-gray-800 p-6 rounded-2xl border border-white/5 relative group">
            <button 
              onClick={() => deleteMessage(msg.id)} 
              className="absolute top-6 right-6 p-2 bg-red-500/10 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
              title="Delete message"
            >
              <Trash2 size={18} />
            </button>
            
            <div className="flex items-start gap-4 mb-4 pr-12">
              <div className="w-12 h-12 bg-brand-light-blue/20 rounded-full flex items-center justify-center shrink-0">
                <span className="text-brand-light-blue font-bold text-xl uppercase">
                  {msg.first_name?.[0]}{msg.last_name?.[0] || ''}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">
                  {msg.first_name} {msg.last_name || ''}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                  <a href={`mailto:${msg.email}`} className="flex items-center gap-1 hover:text-brand-light-blue transition-colors">
                    <Mail size={14} /> {msg.email}
                  </a>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 p-4 rounded-xl border border-white/5">
              <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
            </div>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="text-center py-24 bg-gray-800 rounded-2xl border border-white/5">
            <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400">No messages yet</h3>
            <p className="text-gray-500 mt-2">When visitors use your contact form, their messages will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
