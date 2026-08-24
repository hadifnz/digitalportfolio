"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    involvements: 0,
    messages: 0
  });
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      const [{ count: pCount }, { count: iCount }, { count: mCount }] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('involvements').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        projects: pCount || 0,
        involvements: iCount || 0,
        messages: mCount || 0
      });
    }

    fetchStats();
  }, [supabase]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-heading text-white tracking-widest mb-8">DASHBOARD</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-2xl border border-white/5 shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium tracking-wider mb-2">TOTAL PROJECTS</h3>
          <p className="text-4xl font-heading text-brand-light-blue">{stats.projects}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl border border-white/5 shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium tracking-wider mb-2">INVOLVEMENTS</h3>
          <p className="text-4xl font-heading text-brand-light-blue">{stats.involvements}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl border border-white/5 shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium tracking-wider mb-2">NEW MESSAGES</h3>
          <p className="text-4xl font-heading text-brand-light-blue">{stats.messages}</p>
        </div>
      </div>
    </div>
  );
}
