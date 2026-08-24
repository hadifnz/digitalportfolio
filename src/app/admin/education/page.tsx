"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { Trash2, Edit2 } from "lucide-react";

export default function AdminEducation() {
  const [education, setEducation] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const supabase = createClient();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      degree: "",
      university: "",
      start_date: "",
      end_date: "",
      order_index: 0
    }
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  async function fetchEducation() {
    const { data } = await supabase.from('education').select('*').order('order_index', { ascending: true });
    if (data) setEducation(data);
  }

  const onSubmit = async (data: any) => {
    if (editingId) {
      await supabase.from('education').update(data).eq('id', editingId);
    } else {
      await supabase.from('education').insert([data]);
    }
    setEditingId(null);
    reset();
    fetchEducation();
  };

  const editItem = (item: any) => {
    setEditingId(item.id);
    reset({
      degree: item.degree,
      university: item.university,
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      order_index: item.order_index
    });
  };

  const deleteItem = async (id: string) => {
    if (confirm("Are you sure?")) {
      await supabase.from('education').delete().eq('id', id);
      fetchEducation();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto pb-32">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading tracking-widest text-white">EDUCATION TIMELINE</h1>
        {editingId && (
          <button onClick={() => { setEditingId(null); reset(); }} className="text-gray-400 hover:text-white transition-colors">
            Cancel Edit
          </button>
        )}
      </div>

      <div className="bg-gray-800 p-6 rounded-2xl border border-white/5 mb-12">
        <h2 className="text-xl font-medium mb-6">{editingId ? "Edit Education" : "Add Education"}</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Degree / Qualification</label>
              <input {...register("degree")} required className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Institution / University</label>
              <input {...register("university")} required className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Start Date (e.g. 2020)</label>
              <input {...register("start_date")} className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">End Date (e.g. 2024)</label>
              <input {...register("end_date")} className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Order Index</label>
              <input type="number" {...register("order_index")} className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue" />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button type="submit" className="w-full bg-brand-light-blue hover:bg-white text-brand-blue font-bold tracking-widest py-3 rounded-xl transition-colors">
              {editingId ? "UPDATE" : "SAVE"}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-6">Existing Entries</h2>
        <div className="grid gap-4">
          {education.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-white/5">
              <div>
                <h3 className="font-bold text-lg">{item.degree}</h3>
                <p className="text-sm text-gray-400">{item.university} | {item.start_date} - {item.end_date}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => editItem(item)} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"><Edit2 size={18} /></button>
                <button onClick={() => deleteItem(item.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
          {education.length === 0 && <p className="text-gray-500 text-center py-8">No records found.</p>}
        </div>
      </div>
    </div>
  );
}
