import { createClient } from "@/utils/supabase/server";
import KYouthAccordion from "./KYouthAccordion";
import FadeIn from "./FadeIn";

export default async function KYouthSection() {
  const supabase = createClient();
  const { data: scenarios } = await supabase.from('k_youth').select('*').order('order_index', { ascending: true });
  const { data: settings } = await supabase.from('site_settings').select('kyouth_logo_url').limit(1).single();

  return (
    <section id="k-youth" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      <div className="flex flex-col items-center">
        <FadeIn delay={0.2} direction="up" className="flex items-center space-x-4 mb-16">
          <div className="w-16 h-16 bg-white flex items-center justify-center rounded-lg shadow-lg overflow-hidden">
             {settings?.kyouth_logo_url ? (
               <img src={settings.kyouth_logo_url} alt="K-Youth Logo" className="w-full h-full object-contain p-1" />
             ) : (
               <span className="text-green-500 font-bold text-2xl italic">K</span>
             )}
          </div>
          <h2 className="text-5xl md:text-7xl font-heading text-brand-text tracking-widest">K-YOUTH</h2>
        </FadeIn>

        {/* Scenarios Accordion / List */}
        <FadeIn delay={0.4} direction="up" className="w-full">
          <KYouthAccordion scenarios={scenarios || []} />
        </FadeIn>
      </div>
    </section>
  );
}
