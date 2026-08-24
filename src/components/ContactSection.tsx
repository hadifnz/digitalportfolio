"use client";
import { Mail, Linkedin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import FadeIn from "./FadeIn";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    setSuccess(false);
    
    const { error } = await supabase.from('messages').insert([{
      first_name: data.firstName,
      last_name: data.lastName || null,
      email: data.email,
      message: data.message
    }]);

    if (!error) {
      setSuccess(true);
      reset();
    } else {
      alert("Error sending message. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <FadeIn delay={0.2} direction="up" className="flex flex-col items-center mb-16">
        <h2 className="text-5xl md:text-7xl font-heading text-brand-text tracking-widest text-center">LET'S GET CONNECTED</h2>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Form */}
        <FadeIn delay={0.4} direction="left">
          <h3 className="text-2xl font-heading text-brand-light-blue tracking-widest mb-6">NAME</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-brand-light-blue font-heading tracking-widest mb-2">FIRST NAME</label>
                <input 
                  type="text" 
                  {...register("firstName")}
                  className="w-full bg-white rounded-2xl h-14 px-4 text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-light-blue"
                />
                {errors.firstName && <p className="text-red-400 mt-1 text-sm">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-brand-light-blue font-heading tracking-widest mb-2">LAST NAME</label>
                <input 
                  type="text" 
                  {...register("lastName")}
                  className="w-full bg-white rounded-2xl h-14 px-4 text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-light-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-brand-light-blue font-heading tracking-widest mb-2">EMAIL</label>
              <input 
                type="email" 
                {...register("email")}
                className="w-full bg-white rounded-2xl h-14 px-4 text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-light-blue"
              />
              {errors.email && <p className="text-red-400 mt-1 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-brand-light-blue font-heading tracking-widest mb-2">MESSAGE</label>
              <textarea 
                {...register("message")}
                rows={6}
                className="w-full bg-white rounded-3xl p-4 text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-light-blue resize-none"
              />
              {errors.message && <p className="text-red-400 mt-1 text-sm">{errors.message.message}</p>}
            </div>

            <button disabled={loading} type="submit" className="w-full bg-brand-light-blue text-brand-blue font-heading tracking-widest text-xl h-14 rounded-full hover:bg-white transition-colors">
              {loading ? "SENDING..." : "SEND MESSAGE"}
            </button>
            
            {success && (
              <div className="p-4 bg-green-500/20 border border-green-500 rounded-xl text-green-400 text-center font-medium">
                Message sent successfully! I'll get back to you soon.
              </div>
            )}
          </form>
        </FadeIn>

        {/* Contact Details */}
        <FadeIn delay={0.6} direction="right" className="lg:pl-16 mt-8 lg:mt-[5.5rem]">
          <h3 className="text-4xl md:text-5xl font-heading text-white tracking-widest mb-8">HADIF NAZRUJEHAN</h3>
          <div className="space-y-6">
            <a href="mailto:hadifnazrujehan@gmail.com" className="flex items-center space-x-4 text-gray-200 hover:text-white transition-colors">
              <div className="bg-brand-light-blue/20 p-2 rounded-lg">
                <Mail className="w-8 h-8 text-brand-light-blue" />
              </div>
              <span className="text-xl">hadifnazrujehan@gmail.com</span>
            </a>
            <a href="https://linkedin.com/in/hadifnazrujehan" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 text-gray-200 hover:text-white transition-colors">
              <div className="bg-brand-light-blue/20 p-2 rounded-lg">
                <Linkedin className="w-8 h-8 text-brand-light-blue" />
              </div>
              <span className="text-xl">hadifnazrujehan</span>
            </a>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
