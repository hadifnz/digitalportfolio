"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Edit2, Image as ImageIcon, FileText } from "lucide-react";

export default function AdminKYouth() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<{ [key: number]: boolean }>({});
  
  const supabase = createClient();
  const { register, handleSubmit, control, reset, watch, setValue } = useForm({
    defaultValues: {
      scenario_title: "",
      description: "",
      documents: [{ name: "", url: "" }] // Array of { name, url }
    }
  });

  const { fields: docFields, append: docAppend, remove: docRemove } = useFieldArray({
    control,
    name: "documents"
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: kyouthData } = await supabase.from('k_youth').select('*').order('order_index', { ascending: true });
    if (kyouthData) setScenarios(kyouthData);

    const { data: settingsData } = await supabase.from('site_settings').select('*').limit(1).single();
    if (settingsData) setSiteSettings(settingsData);
  }

  // Upload Logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingLogo(true);
      const file = e.target.files?.[0];
      if (!file || !siteSettings?.id) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `kyouth-logo-${Math.random()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('portfolio-images').getPublicUrl(filePath);
      
      await supabase.from('site_settings').update({ kyouth_logo_url: data.publicUrl }).eq('id', siteSettings.id);
      fetchData();
    } catch (error) {
      alert("Error uploading logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  // Upload Document (PDF)
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    try {
      setUploadingDoc(prev => ({ ...prev, [index]: true }));
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `kyouth-doc-${Math.random()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('portfolio-images').getPublicUrl(filePath);
      
      // Update the specific document's URL field in the form
      setValue(`documents.${index}.url`, data.publicUrl);
    } catch (error) {
      alert("Error uploading document");
    } finally {
      setUploadingDoc(prev => ({ ...prev, [index]: false }));
    }
  };

  const onSubmit = async (data: any) => {
    const formattedData = {
      scenario_title: data.scenario_title,
      description: data.description,
      // Filter out empty documents
      documents: data.documents.filter((d: any) => d.name.trim() !== "" && d.url.trim() !== ""),
    };

    if (editingId) {
      await supabase.from('k_youth').update(formattedData).eq('id', editingId);
    } else {
      await supabase.from('k_youth').insert([formattedData]);
    }

    setEditingId(null);
    reset();
    fetchData();
  };

  const editScenario = (s: any) => {
    setEditingId(s.id);
    reset({
      scenario_title: s.scenario_title,
      description: s.description || "",
      documents: s.documents?.length ? s.documents : [{ name: "", url: "" }]
    });
  };

  const deleteScenario = async (id: string) => {
    if (confirm("Are you sure?")) {
      await supabase.from('k_youth').delete().eq('id', id);
      fetchData();
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto pb-32">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading tracking-widest text-white">MANAGE K-YOUTH</h1>
      </div>

      {/* Settings Area (Logo) */}
      <div className="bg-gray-800 p-6 rounded-2xl border border-white/5 mb-12 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium mb-2">K-Youth Logo</h2>
          <p className="text-sm text-gray-400">This logo will appear next to the K-YOUTH title on the live site.</p>
        </div>
        <div className="flex items-center space-x-4">
          {siteSettings?.kyouth_logo_url ? (
            <img src={siteSettings.kyouth_logo_url} alt="Logo" className="w-16 h-16 rounded bg-white object-contain p-1" />
          ) : (
            <div className="w-16 h-16 rounded border border-dashed border-gray-600 flex items-center justify-center text-gray-500">
              Logo
            </div>
          )}
          <label className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors">
            <ImageIcon size={18} />
            <span>{uploadingLogo ? "Uploading..." : "Upload Logo"}</span>
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploadingLogo || !siteSettings} />
          </label>
        </div>
      </div>

      {/* Scenarios Form Area */}
      <div className="bg-gray-800 p-6 rounded-2xl border border-white/5 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">{editingId ? "Edit Scenario" : "Add New Scenario"}</h2>
          {editingId && (
            <button onClick={() => { setEditingId(null); reset(); }} className="text-gray-400 hover:text-white transition-colors">
              Cancel Edit
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Scenario Title</label>
            <input 
              {...register("scenario_title")} 
              placeholder="e.g. SCENARIO 1"
              required
              className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
            <textarea 
              {...register("description")} 
              rows={3}
              placeholder="Description of the scenario..."
              className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue" 
            />
          </div>

          {/* Documents (Deliverables) */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Deliverables (Documents)</label>
            <div className="space-y-4">
              {docFields.map((field, index) => {
                const currentUrl = watch(`documents.${index}.url`);
                
                return (
                  <div key={field.id} className="flex gap-4 p-4 bg-gray-900/50 rounded-xl border border-white/5">
                    <div className="flex-1 space-y-4">
                      {/* Name input */}
                      <div>
                         <label className="block text-xs text-gray-500 mb-1">Document Name (e.g. "Memo")</label>
                         <input
                          {...register(`documents.${index}.name`)}
                          placeholder="Document Name"
                          className="w-full bg-gray-900 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-brand-light-blue"
                        />
                      </div>
                      
                      {/* File Upload OR URL input */}
                      <div className="flex gap-2 items-end">
                         <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">Document File (PDF / Link)</label>
                            <input
                              {...register(`documents.${index}.url`)}
                              placeholder="https://... or click Upload"
                              className="w-full bg-gray-900 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-brand-light-blue text-sm"
                            />
                         </div>
                         <label className={`shrink-0 flex items-center space-x-2 px-3 py-2 ${currentUrl ? 'bg-green-500/20 text-green-400' : 'bg-brand-blue hover:bg-brand-light-blue hover:text-brand-blue text-white'} rounded-lg cursor-pointer transition-colors text-sm font-medium`}>
                           <FileText size={16} />
                           <span>{uploadingDoc[index] ? "Uploading..." : currentUrl ? "Replace File" : "Upload File"}</span>
                           <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" onChange={(e) => handleDocumentUpload(e, index)} className="hidden" disabled={uploadingDoc[index]} />
                         </label>
                      </div>
                    </div>
                    
                    <button type="button" onClick={() => docRemove(index)} className="self-center p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
              <button type="button" onClick={() => docAppend({ name: "", url: "" })} className="text-brand-light-blue text-sm font-medium hover:underline flex items-center">
                <Plus size={16} className="mr-1" /> Add Document
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button type="submit" className="w-full bg-brand-light-blue hover:bg-white text-brand-blue font-bold tracking-widest py-3 rounded-xl transition-colors">
              {editingId ? "UPDATE SCENARIO" : "SAVE SCENARIO"}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Scenarios List */}
      <div>
        <h2 className="text-xl font-medium mb-6">Existing Scenarios</h2>
        <div className="grid gap-4">
          {scenarios.map(s => (
            <div key={s.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-white/5">
              <div>
                <h3 className="font-bold text-lg">{s.scenario_title}</h3>
                <p className="text-sm text-gray-400 mt-1">{s.documents?.length || 0} documents attached</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => editScenario(s)} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => deleteScenario(s.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {scenarios.length === 0 && <p className="text-gray-500 text-center py-8">No scenarios found.</p>}
        </div>
      </div>
    </div>
  );
}
