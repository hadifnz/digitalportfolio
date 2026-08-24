import { ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import FadeIn from "./FadeIn";
import InvolvementGrid from "./InvolvementGrid";

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
          <InvolvementGrid involvements={involvements || []} />

          {/* Right Arrow (Carousel feel) */}
          <button className="hidden lg:flex absolute -right-16 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
            <ChevronRight className="w-16 h-16" strokeWidth={1} />
          </button>
        </div>
      </div>
    </section>
  );
}
