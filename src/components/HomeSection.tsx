import { createClient } from "@/utils/supabase/server";
import FadeIn from "./FadeIn";

export default async function HomeSection() {
  const supabase = createClient();
  const { data: settings } = await supabase.from('site_settings').select('hero_name, hero_description, hero_image_url').limit(1).single();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden w-full">
      {/* Huge PORTFOLIO text in the background */}
      <FadeIn delay={0.1} direction="up" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <h1 
          className="text-[35vw] md:text-[20vw] text-white drop-shadow-2xl whitespace-nowrap"
          style={{ fontFamily: "'Hey Gotcha', cursive" }}
        >
          PORTFOLIO
        </h1>
      </FadeIn>

      {/* Portrait / Cutout image */}
      <div className="relative z-10 flex flex-col items-center justify-end h-full pt-32 w-full max-w-2xl mx-auto">
        <FadeIn delay={0.4} direction="up" className="relative w-full h-[60vh] md:h-[80vh] flex justify-center items-end">
          {settings?.hero_image_url ? (
            <img 
              src={settings.hero_image_url} 
              alt={settings.hero_name || "Hero"}
              className="max-h-full w-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] z-20"
              style={{ 
                WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 15%)', 
                maskImage: 'linear-gradient(to top, transparent 0%, black 15%)' 
              }}
            />
          ) : (
            <div className="absolute inset-x-0 bottom-0 top-1/4 bg-gray-400/20 backdrop-blur-sm rounded-t-full flex items-center justify-center border border-white/20 max-w-[400px] mx-auto z-20">
              <span className="text-white/50 text-center px-4">
                [Portrait Cutout Image]
                <br />
                {settings?.hero_name || "Name Placeholder"}
              </span>
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
