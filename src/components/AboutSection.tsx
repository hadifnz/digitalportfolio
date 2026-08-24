import { Mail, Linkedin } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import FadeIn from "./FadeIn";

export default async function AboutSection() {
  const supabase = createClient();
  
  const [
    { data: settings },
    { data: education },
    { data: experience }
  ] = await Promise.all([
    supabase.from('site_settings').select('*').limit(1).single(),
    supabase.from('education').select('*').order('order_index', { ascending: true }),
    supabase.from('experience').select('*').order('order_index', { ascending: true }),
  ]);

  return (
    <section id="about" className="py-24 relative w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column (Image & Bio) */}
          <FadeIn delay={0.2} direction="left" className="lg:col-span-5 flex flex-col relative z-10">
            
            {/* Image & Box Container */}
            {/* Reduced height by another 10% (from 50vh to 45vh) */}
            <div className="relative w-full lg:w-[45vw] h-[40vh] lg:h-[45vh] mb-12 flex justify-start items-end z-10 lg:ml-[calc(-45vw+100%)]">
              
              {/* Solid blue box. right-8 and lg:right-16 makes it end earlier, making it horizontally shorter */}
              <div className="absolute right-8 lg:right-16 bottom-0 w-[100vw] h-[85%] bg-brand-blue rounded-r-[3rem] -z-10 shadow-2xl border border-white/5" />
              
              {settings?.about_image_url ? (
                <img 
                  src={settings.about_image_url} 
                  alt="About Me" 
                  /* translate-x-8 and lg:translate-x-16 moves the picture slightly to the right */
                  className="h-[115%] w-auto max-w-none object-contain object-left-bottom drop-shadow-[25px_15px_35px_rgba(0,0,0,0.85)] z-10 translate-x-8 lg:translate-x-16" 
                />
              ) : (
                <div className="w-64 h-64 bg-white/5 rounded-lg overflow-hidden border border-white/10 relative shadow-2xl ml-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/30 text-sm text-center font-body">Upload Image in Admin</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
              <h2 className="text-5xl md:text-7xl font-heading text-brand-light-blue mb-6">HELLO,</h2>
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-body whitespace-pre-wrap">
                {settings?.about_description || "I'm a passionate software developer dedicated to building seamless digital experiences and crafting efficient, innovative tech solutions."}
              </p>
            </div>
          </FadeIn>

          {/* Right Column (Title, Contact, Education, Experience) */}
          <div className="lg:col-span-7 flex flex-col space-y-16 lg:pl-8 pt-8">
            <FadeIn delay={0.4} direction="up">
              <h1 className="text-6xl md:text-8xl font-heading text-white drop-shadow-lg tracking-wider">ABOUT ME</h1>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Sub-Left Column: Contact & Education */}
              <div className="space-y-16">
                
                {/* Contact */}
                <FadeIn delay={0.5} direction="up">
                  <h2 className="text-4xl md:text-5xl font-heading text-brand-light-blue mb-6">CONTACT</h2>
                  <div className="space-y-4 font-body">
                    <a href={`mailto:${settings?.contact_email || "hadifnazrujehan@gmail.com"}`} className="flex items-center space-x-4 text-gray-200 hover:text-white transition-colors">
                      <Mail className="w-6 h-6 text-brand-light-blue shrink-0" />
                      <span className="text-lg break-words">{settings?.contact_email || "hadifnazrujehan@gmail.com"}</span>
                    </a>
                    <a 
                      href={settings?.linkedin_url ? (settings.linkedin_url.startsWith('http') ? settings.linkedin_url : `https://${settings.linkedin_url}`) : "https://linkedin.com/in/hadifnazrujehan"} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center space-x-4 text-gray-200 hover:text-white transition-colors"
                    >
                      <Linkedin className="w-6 h-6 text-brand-light-blue shrink-0" />
                      <span className="text-lg break-all mt-1">
                        {settings?.linkedin_url
                          ? settings.linkedin_url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/^linkedin\.com\/in\//, '').replace(/\/$/, '')
                          : "hadifnazrujehan"}
                      </span>
                    </a>
                  </div>
                </FadeIn>

                {/* Education */}
                <FadeIn delay={0.6} direction="up">
                  <h2 className="text-4xl md:text-5xl font-heading text-brand-light-blue mb-8">EDUCATION</h2>
                  <div className="space-y-10 relative before:absolute before:inset-0 before:ml-[9px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent font-body">
                    {education?.map((item: any) => (
                      <div key={item.id} className="relative flex items-start justify-normal group is-active">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-brand-blue bg-brand-light-blue shadow shrink-0 mt-1"></div>
                        <div className="w-[calc(100%-2rem)] ml-6">
                          <h3 className="font-bold text-white text-lg leading-snug">{item.degree}</h3>
                          <p className="text-gray-300 text-sm mt-1">{item.university}</p>
                          <p className="text-brand-light-blue text-xs mt-1 tracking-widest">{item.start_date} - {item.end_date}</p>
                        </div>
                      </div>
                    ))}
                    {!education?.length && (
                       <p className="text-gray-500 italic ml-6">No education records.</p>
                    )}
                  </div>
                </FadeIn>

              </div>

              {/* Sub-Right Column: Experience */}
              <FadeIn delay={0.7} direction="up">
                <h2 className="text-4xl md:text-5xl font-heading text-brand-light-blue mb-8">EXPERIENCE</h2>
                <div className="space-y-10 relative before:absolute before:inset-0 before:ml-[9px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent font-body">
                  {experience?.map((item: any) => (
                    <div key={item.id} className="relative flex items-start justify-normal group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-brand-blue bg-brand-light-blue shadow shrink-0 transform rotate-45 mt-1"></div>
                      <div className="w-[calc(100%-2rem)] ml-6">
                        <span className="text-brand-light-blue text-xs tracking-widest block mb-1">{item.start_date} - {item.end_date}</span>
                        <h3 className="font-bold text-white text-lg leading-snug underline underline-offset-4 decoration-white/30">{item.company}</h3>
                        <p className="text-gray-300 text-sm mt-2">{item.role}</p>
                      </div>
                    </div>
                  ))}
                  {!experience?.length && (
                     <p className="text-gray-500 italic ml-6">No experience records.</p>
                  )}
                </div>
              </FadeIn>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
