"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { Trash2, Edit2, Image as ImageIcon } from "lucide-react";
import ImageCropper from "@/components/ImageCropper";

const defaultValues = {
  title: "",
  organization: "",
  year: "",
  description: "",
  image_url: "",
  order_index: 0
};

export default function AdminInvolvement() {
  const [involvements, setInvolvements] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [croppingImage, setCroppingImage] = useState<{ src: string } | null>(null);
  
  const supabase = createClient();
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues
  });

  const currentFormValues = watch();

  useEffect(() => {
    fetchInvolvements();
  }, []);

  async function fetchInvolvements() {
    const { data } = await supabase.from('involvements').select('*').order('order_index', { ascending: true });
    if (data) setInvolvements(data);
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCroppingImage({ src: reader.result as string });
    };
    reader.readAsDataURL(file);
    
    e.target.value = '';
  };

  const onCropComplete = async (croppedFile: File) => {
    if (!croppingImage) return;
    setCroppingImage(null);

    try {
      setUploading(true);
      const fileExt = "png";
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `involvements/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, croppedFile);

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
    if (editingId) {
      await supabase.from('involvements').update(data).eq('id', editingId);
    } else {
      await supabase.from('involvements').insert([data]);
    }
    setEditingId(null);
    reset(defaultValues); // Explicitly reset to default blank values
    fetchInvolvements();
  };

  const editItem = (item: any) => {
    setEditingId(item.id);
    reset({
      title: item.title,
      organization: item.organization,
      year: item.year || "",
      description: item.description || "",
      image_url: item.image_url || "",
      order_index: item.order_index
    });
  };

  const deleteItem = async (id: string) => {
    if (confirm("Are you sure?")) {
      await supabase.from('involvements').delete().eq('id', id);
      fetchInvolvements();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto pb-32">
      {croppingImage && (
        <ImageCropper 
          imageSrc={croppingImage.src} 
          onCropComplete={onCropComplete} 
          onCancel={() => setCroppingImage(null)} 
        />
      )}
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading tracking-widest text-white">INVOLVEMENT GALLERY</h1>
        {editingId && (
          <button onClick={() => { setEditingId(null); reset(defaultValues); }} className="text-gray-400 hover:text-white transition-colors">
            Cancel Edit
          </button>
        )}
      </div>

      <div className="bg-gray-800 p-6 rounded-2xl border border-white/5 mb-12">
        <h2 className="text-xl font-medium mb-6">{editingId ? "Edit Involvement" : "Add Involvement"}</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Title / Role</label>
              <input {...register("title")} required className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Organization</label>
              <input {...register("organization")} required className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Year (e.g. 2023)</label>
              <input {...register("year")} className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Order Index</label>
              <input type="number" {...register("order_index")} className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
            <textarea {...register("description")} rows={3} className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue resize-none" />
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

          <div className="pt-4 border-t border-white/10">
            <button type="submit" className="w-full bg-brand-light-blue hover:bg-white text-brand-blue font-bold tracking-widest py-3 rounded-xl transition-colors">
              {editingId ? "UPDATE" : "SAVE"}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-6">Existing Entries</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {involvements.map(item => (
            <div key={item.id} className="flex flex-col p-4 bg-gray-800 rounded-xl border border-white/5 relative group">
              <div className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => editItem(item)} className="p-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-500"><Edit2 size={16} /></button>
                <button onClick={() => deleteItem(item.id)} className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500"><Trash2 size={16} /></button>
              </div>
              
              <div className="flex gap-4">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-20 h-24 object-cover rounded-lg" />
                ) : (
                  <div className="w-20 h-24 bg-gray-900 rounded-lg flex items-center justify-center text-xs text-gray-500">No Img</div>
                )}
                <div>
                  <h3 className="font-bold text-lg leading-tight mb-1">{item.title}</h3>
                  <p className="text-sm text-brand-light-blue">{item.year} | {item.organization}</p>
                </div>
              </div>
            </div>
          ))}
          {involvements.length === 0 && <p className="text-gray-500 text-center py-8 col-span-2">No records found.</p>}
        </div>
      </div>
    </div>
  );
}
