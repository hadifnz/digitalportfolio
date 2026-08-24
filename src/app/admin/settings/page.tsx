"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import ImageCropper from "@/components/ImageCropper";

export default function AdminSettings() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      hero_name: "",
      hero_description: "",
      logo_url: "",
      hero_bg_url: "",
      hero_image_url: "",
    }
  });

  const [uploading, setUploading] = useState(false);
  const currentFormValues = watch();

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase.from('site_settings').select('*').limit(1).single();
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
      logo_url: currentFormValues.logo_url,
      hero_bg_url: currentFormValues.hero_bg_url,
      hero_image_url: currentFormValues.hero_image_url,
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
      alert("Error saving settings: " + dbError.message);
    } else {
      alert("Settings saved successfully!");
      router.refresh(); // Tells Next.js to immediately update the Navbar and Layout!
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
      <h1 className="text-3xl font-heading tracking-widest text-white mb-8">GLOBAL & HERO SETTINGS</h1>

      <div className="bg-gray-800 p-6 rounded-2xl border border-white/5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Name (Hero Section)</label>
            <input 
              {...register("hero_name")} 
              className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue" 
              placeholder="e.g. Muhammad Hadif"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Short Intro / Hero Description</label>
            <textarea 
              {...register("hero_description")} 
              rows={3}
              className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-light-blue resize-none" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Navbar Logo</label>
              <div className="flex flex-col space-y-2">
                {currentFormValues.logo_url && (
                  <img src={currentFormValues.logo_url} alt="Logo" className="h-12 w-auto object-contain bg-white/10 rounded-lg p-2" />
                )}
                <label className="flex justify-center items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors text-sm">
                  <span>{uploading ? "..." : "Upload Logo"}</span>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo_url')} className="hidden" disabled={uploading} />
                </label>
              </div>
            </div>

            {/* Background Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Hero Background</label>
              <div className="flex flex-col space-y-2">
                {currentFormValues.hero_bg_url && (
                  <img src={currentFormValues.hero_bg_url} alt="BG" className="h-12 w-full object-cover bg-white/10 rounded-lg" />
                )}
                <label className="flex justify-center items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors text-sm">
                  <span>{uploading ? "..." : "Upload Background"}</span>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero_bg_url')} className="hidden" disabled={uploading} />
                </label>
              </div>
            </div>

            {/* Hero Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Hero Portrait Cutout</label>
              <div className="flex flex-col space-y-2">
                {currentFormValues.hero_image_url && (
                  <img src={currentFormValues.hero_image_url} alt="Hero" className="h-12 w-12 object-cover bg-white/10 rounded-lg mx-auto" />
                )}
                <label className="flex justify-center items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors text-sm">
                  <span>{uploading ? "..." : "Upload Portrait"}</span>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero_image_url')} className="hidden" disabled={uploading} />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button disabled={loading} type="submit" className="w-full bg-brand-light-blue hover:bg-white text-brand-blue font-bold tracking-widest py-3 rounded-xl transition-colors">
              {loading ? "SAVING..." : "SAVE SETTINGS"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
