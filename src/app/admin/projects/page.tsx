"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Edit2, Eye, X, Image as ImageIcon, Smartphone, Monitor } from "lucide-react";

// Reuse the exact same structure for the Live Preview
function ProjectPreview({ project }: { project: any }) {
  const isLaptop = project.device_type === 'laptop';

  return (
    <div className="bg-brand-blue min-h-screen text-brand-text overflow-y-auto">
      <section className="py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center relative scale-90 origin-top">
          <h2 className="text-3xl md:text-5xl font-heading text-brand-text mb-6 uppercase tracking-wider text-center">PROJECT</h2>
          <h3 className="text-xl md:text-3xl font-heading text-brand-text mb-8 uppercase tracking-wider text-center">
            {project.title || "PROJECT TITLE"}
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start w-full">
            {/* Device Mockup */}
            <div className="w-full flex justify-center pt-4">
              {isLaptop ? (
                <div className="relative w-full max-w-sm lg:max-w-md transform -rotate-6 transition-transform duration-500">
                  <div className="w-full aspect-[16/10] rounded-t-xl border-[8px] border-gray-900 bg-black overflow-hidden relative shadow-2xl">
                    {project.image_url ? (
                      <img src={project.image_url} alt="Project" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                         <span className="text-white/50 text-center px-4 text-sm">Image Placeholder</span>
                      </div>
                    )}
                  </div>
                  <div className="w-[110%] -ml-[5%] h-3 sm:h-4 bg-gradient-to-b from-gray-400 to-gray-600 rounded-b-xl shadow-2xl relative z-10 border-t border-gray-300" />
                  <div className="w-[20%] mx-auto h-1 bg-gray-400 rounded-b-md shadow-inner" />
                </div>
              ) : (
                <div className="relative w-full max-w-[10rem] sm:max-w-[12rem] aspect-[1/2] rounded-[2rem] border-[6px] sm:border-8 border-gray-900 bg-black overflow-hidden shadow-2xl transform -rotate-6 transition-transform duration-500">
                  {project.image_url ? (
                    <img src={project.image_url} alt="Project" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                       <span className="text-white/50 text-center px-4 text-sm">Image Placeholder</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-8">
              {project.bullet_points && project.bullet_points.length > 0 && (
                <ul className="space-y-4 list-disc list-inside text-gray-200 text-lg font-body leading-relaxed marker:text-white">
                  {project.bullet_points.map((bp: string, i: number) => (
                    <li key={i}>{bp}</li>
                  ))}
                </ul>
              )}

              <div>
                <h4 className="text-2xl font-heading text-brand-text mb-4 uppercase tracking-wider">LANGUAGE & TOOLS</h4>
                <div className="flex flex-wrap gap-4">
                  {project.tech_stack?.map((tech: string, i: number) => (
                    <div key={i} className="px-4 py-2 bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium text-white">
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const supabase = createClient();
  const { register, handleSubmit, control, reset, watch, setValue } = useForm({
    defaultValues: {
      title: "",
      device_type: "mobile",
      bullet_points: [{ value: "" }],
      tech_stack: [{ value: "" }],
      image_url: "",
    }
  });

  const { fields: bpFields, append: bpAppend, remove: bpRemove } = useFieldArray({ control, name: "bullet_points" });
  const { fields: tsFields, append: tsAppend, remove: tsRemove } = useFieldArray({ control, name: "tech_stack" });

  const currentFormValues = watch();

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*').order('order_index', { ascending: true });
    if (data) setProjects(data);
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('portfolio-images').getPublicUrl(filePath);
      setValue('image_url', data.publicUrl);
    } catch (error) {
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    const formattedData = {
      title: data.title,
      device_type: data.device_type,
      bullet_points: data.bullet_points.map((b: any) => b.value).filter(Boolean),
      tech_stack: data.tech_stack.map((t: any) => t.value).filter(Boolean),
      image_url: data.image_url,
    };

    if (editingId) {
      await supabase.from('projects').update(formattedData).eq('id', editingId);
    } else {
      await supabase.from('projects').insert([formattedData]);
    }

    setEditingId(null);
    reset();
    fetchProjects();
  };

  const editProject = (p: any) => {
    setEditingId(p.id);
    reset({
      title: p.title,
      device_type: p.device_type || "mobile",
      bullet_points: p.bullet_points?.length ? p.bullet_points.map((val: string) => ({ value: val })) : [{ value: "" }],
      tech_stack: p.tech_stack?.length ? p.tech_stack.map((val: string) => ({ value: val })) : [{ value: "" }],
      image_url: p.image_url || "",
    });
  };

  const deleteProject = async (id: string) => {
    if (confirm("Are you sure?")) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  };

  // The draft project to pass to the preview mode
  const draftProject = {
    title: currentFormValues.title,
    device_type: currentFormValues.device_type,
    bullet_points: currentFormValues.bullet_points?.map(b => b.value).filter(Boolean),
    tech_stack: currentFormValues.tech_stack?.map(t => t.value).filter(Boolean),
    image_url: currentFormValues.image_url,
  };

  return (
    <div className="p-8 max-w-5xl mx-auto pb-32">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading tracking-widest text-white">MANAGE PROJECTS</h1>
        {editingId && (
          <button 
            onClick={() => { setEditingId(null); reset(); }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Form Area */}
      <div className="bg-gray-800 p-6 rounded-2xl border border-white/5 mb-12">
        <h2 className="text-xl font-medium mb-6">{editingId ? "Edit Project" : "Add New Project"}</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Project Title</label>
              <input 
                {...register("title")} 
                required
                className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Mockup Device Type</label>
              <div className="flex gap-4">
                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${currentFormValues.device_type === 'mobile' ? 'bg-brand-blue border-brand-light-blue text-white' : 'bg-gray-900 border-white/10 text-gray-400 hover:bg-gray-800'}`}>
                  <input type="radio" value="mobile" {...register("device_type")} className="hidden" />
                  <Smartphone size={18} /> Mobile
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${currentFormValues.device_type === 'laptop' ? 'bg-brand-blue border-brand-light-blue text-white' : 'bg-gray-900 border-white/10 text-gray-400 hover:bg-gray-800'}`}>
                  <input type="radio" value="laptop" {...register("device_type")} className="hidden" />
                  <Monitor size={18} /> Laptop
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Image Upload</label>
            <div className="flex items-center space-x-4">
              {currentFormValues.image_url && (
                <img src={currentFormValues.image_url} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
              )}
              <label className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors">
                <ImageIcon size={18} />
                <span>{uploading ? "Uploading..." : "Select Image"}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>

          {/* Bullet Points */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Key Features (Bullet Points)</label>
            <div className="space-y-3">
              {bpFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    {...register(`bullet_points.${index}.value`)}
                    className="flex-1 bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue"
                  />
                  <button type="button" onClick={() => bpRemove(index)} className="p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => bpAppend({ value: "" })} className="text-brand-light-blue text-sm font-medium hover:underline flex items-center">
                <Plus size={16} className="mr-1" /> Add Feature
              </button>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Technologies (Tech Stack)</label>
            <div className="space-y-3">
              {tsFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    {...register(`tech_stack.${index}.value`)}
                    className="flex-1 bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue"
                  />
                  <button type="button" onClick={() => tsRemove(index)} className="p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => tsAppend({ value: "" })} className="text-brand-light-blue text-sm font-medium hover:underline flex items-center">
                <Plus size={16} className="mr-1" /> Add Technology
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setIsPreviewOpen(true)} className="flex-1 flex justify-center items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-xl transition-colors">
              <Eye size={18} /> Live Preview
            </button>
            <button type="submit" className="flex-1 bg-brand-light-blue hover:bg-white text-brand-blue font-bold tracking-widest py-3 rounded-xl transition-colors">
              {editingId ? "UPDATE PROJECT" : "SAVE PROJECT"}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Projects List */}
      <div>
        <h2 className="text-xl font-medium mb-6">Existing Projects</h2>
        <div className="grid gap-4">
          {projects.map(p => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-white/5">
              <div>
                <h3 className="font-bold text-lg">{p.title}</h3>
                <span className="text-xs text-gray-500 capitalize">{p.device_type || "Mobile"} Mockup</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => editProject(p)} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => deleteProject(p.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p className="text-gray-500 text-center py-8">No projects found.</p>}
        </div>
      </div>

      {/* Live Preview Modal */}
      {isPreviewOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-12 cursor-pointer" 
          onClick={() => setIsPreviewOpen(false)}
        >
          <div 
            className="relative w-full h-full bg-brand-blue rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col cursor-auto" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-white/10">
              <span className="font-medium text-gray-300 flex items-center gap-2"><Eye size={18}/> Live Preview Mode</span>
              <button 
                type="button" 
                onClick={() => setIsPreviewOpen(false)} 
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ProjectPreview project={draftProject} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
