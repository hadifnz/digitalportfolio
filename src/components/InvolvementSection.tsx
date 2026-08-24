import { ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import FadeIn from "./FadeIn";

export default async function InvolvementSection() {
  const supabase = createClient();
  const { data: involvements } = await supabase.from('involvements').select('*').order('order_index', { ascending: true });

  return (
    <section id="involvement" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col items-center">
        <FadeIn delay={0.2} direction="up">
          <h2 className="text-5xl md:text-7xl font-heading text-brand-text mb-16 uppercase tracking-wider text-center">INVOLVEMENT</h2>
        </FadeIn>
        
        <div className="relative w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {involvements?.map((inv: any, idx: number) => (
              <FadeIn key={inv.id} delay={0.3 + idx * 0.1} direction="up" className="group relative w-full aspect-square bg-white/5 border border-white/10 overflow-hidden cursor-pointer hover:border-brand-light-blue transition-colors">
                <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-brand-blue/90 z-20">
                  <div>
                    <span className="text-brand-light-blue font-heading text-xl">{inv.year}</span>
                    <h3 className="text-white font-bold text-lg mt-2 leading-tight">{inv.title}</h3>
                    <p className="text-white/80 text-sm mt-1">{inv.organization}</p>
                  </div>
                  <p className="text-gray-300 text-sm">{inv.description}</p>
                </div>
                
                {inv.image_url ? (
                  <img src={inv.image_url} alt={inv.title} className="absolute inset-0 w-full h-full object-cover z-0 group-hover:opacity-20 transition-opacity" />
                ) : (
                  <div className="absolute inset-0 bg-gray-600/20 flex items-center justify-center z-10 group-hover:opacity-0 transition-opacity">
                     <span className="text-white/50 text-sm text-center px-4">No Image</span>
                  </div>
                )}
              </FadeIn>
            ))}
            {!involvements?.length && (
              <p className="text-gray-500 italic col-span-full text-center">No involvement records.</p>
            )}
          </div>

          {/* Right Arrow (Carousel feel) */}
          <button className="hidden lg:flex absolute -right-16 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
            <ChevronRight className="w-16 h-16" strokeWidth={1} />
          </button>
        </div>
      </div>
    </section>
  );
}
