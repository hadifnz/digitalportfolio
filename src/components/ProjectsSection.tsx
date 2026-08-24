import { createClient } from "@/utils/supabase/server";
import ProjectsCarousel from "./ProjectsCarousel";
import FadeIn from "./FadeIn";

export default async function ProjectsSection() {
  const supabase = createClient();
  const { data: projects } = await supabase.from('projects').select('*').order('order_index', { ascending: true });

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col items-center relative space-y-12">
        
        <FadeIn delay={0.2} direction="up">
          <h2 className="text-5xl md:text-7xl font-heading text-brand-text mb-2 uppercase tracking-wider text-center">PROJECT</h2>
        </FadeIn>
        
        <FadeIn delay={0.4} direction="up" className="w-full">
          <ProjectsCarousel projects={projects || []} />
        </FadeIn>
      </div>
    </section>
  );
}
