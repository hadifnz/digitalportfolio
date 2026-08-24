"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import ImageCropper from "@/components/ImageCropper";

export default function AdminAbout() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      about_description: "",
      about_image_url: "",
      contact_email: "",
      linkedin_url: "",
      resume_url: "",
    }
  });

  const [uploading, setUploading] = useState(false);
  const currentFormValues = watch();

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase.from('site_settings').select('about_description, about_image_url, contact_email, linkedin_url, resume_url').limit(1).single();
    if (data) {
      reset(data);
    }
  }

  // State for cropper
  const [croppingImage, setCroppingImage] = useState<{ src: string, fieldName: string } | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read the file as a data URL to pass to the cropper
    const reader = new FileReader();
    reader.onload = () => {
      setCroppingImage({ src: reader.result as string, fieldName });
    };
    reader.readAsDataURL(file);
    
    // Clear the input so the same file can be uploaded again if needed
    e.target.value = '';
  };

  const onCropComplete = async (croppedFile: File) => {
    if (!croppingImage) return;
    const fieldName = croppingImage.fieldName;
    setCroppingImage(null); // close cropper

    try {
      setUploading(true);
      
      const fileExt = "png"; // cropper outputs PNG
      const fileName = `${fieldName}_${Math.random()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, croppedFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('portfolio-images').getPublicUrl(filePath);
      setValue(fieldName as any, data.publicUrl);
    } catch (error) {
      alert("Error uploading cropped image");
    } finally {
      setUploading(false);
    }
  };

  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    
    const finalData = {
      ...data,
      about_image_url: currentFormValues.about_image_url,
    };

    const { data: existing } = await supabase.from('site_settings').select('id').limit(1).single();
    
    let dbError = null;
    if (existing) {
      const { error } = await supabase.from('site_settings').update({ ...finalData, updated_at: new Date() }).eq('id', existing.id);
      dbError = error;
    } else {
      const { error } = await supabase.from('site_settings').insert([finalData]);
      dbError = error;
    }
    
    setLoading(false);

    if (dbError) {
      alert("Error saving about settings: " + dbError.message);
    } else {
      alert("About settings saved successfully!");
      router.refresh(); 
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto pb-32">
      {croppingImage && (
        <ImageCropper 
          imageSrc={croppingImage.src} 
          onCropComplete={onCropComplete} 
          onCancel={() => setCroppingImage(null)} 
        />
      )}
      <h1 className="text-3xl font-heading tracking-widest text-white mb-8">ABOUT ME</h1>

      <div className="bg-gray-800 p-6 rounded-2xl border border-white/5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">About Description</label>
            <textarea 
              {...register("about_description")} 
              rows={6}
              className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue resize-none" 
              placeholder="e.g. I am a passionate software developer..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Contact Email</label>
              <input 
                {...register("contact_email")} 
                className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">LinkedIn Username/URL</label>
              <input 
                {...register("linkedin_url")} 
                className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Resume URL (Optional)</label>
            <input 
              {...register("resume_url")} 
              className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* About Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">About Section Image</label>
              <div className="flex flex-col space-y-2">
                {currentFormValues.about_image_url && (
                  <img src={currentFormValues.about_image_url} alt="About" className="h-24 w-auto object-cover bg-white/10 rounded-lg" />
                )}
                <label className="flex justify-center items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors text-sm">
                  <span>{uploading ? "..." : "Upload Image"}</span>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'about_image_url')} className="hidden" disabled={uploading} />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button disabled={loading} type="submit" className="w-full bg-brand-light-blue hover:bg-white text-brand-blue font-bold tracking-widest py-3 rounded-xl transition-colors">
              {loading ? "SAVING..." : "SAVE ABOUT SETTINGS"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
