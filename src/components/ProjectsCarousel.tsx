"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function ProjectsCarousel({ projects }: { projects: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateProgress = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = scrollWidth > clientWidth ? (scrollLeft / (scrollWidth - clientWidth)) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    updateProgress();
  }, [projects]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full relative group flex flex-col">
      {/* Projects Carousel */}
      <div ref={scrollRef} onScroll={updateProgress} className="w-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 lg:pb-8 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        {projects?.map((project: any) => {
          const isLaptop = project.device_type === 'laptop';
          
          return (
            <div key={project.id} className="w-full shrink-0 snap-center px-4">
              <h3 className="text-2xl md:text-4xl font-heading text-brand-text mb-8 uppercase tracking-wider text-center">
                {project.title}
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                
                {/* Left: Mockup (Conditionally Mobile or Laptop) */}
                <div className="w-full flex justify-center pt-4">
                  {isLaptop ? (
                    /* Laptop Mockup */
                    <div className="relative w-full max-w-sm lg:max-w-md transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                      <div className="w-full aspect-[16/10] rounded-t-xl border-[8px] border-gray-900 bg-black overflow-hidden relative shadow-2xl">
                        {project.image_url ? (
                          <img src={project.image_url} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                             <span className="text-white/50 text-center px-4 text-sm">Image Placeholder</span>
                          </div>
                        )}
                      </div>
                      <div className="w-[110%] -ml-[5%] h-3 sm:h-4 bg-gradient-to-b from-gray-400 to-gray-600 rounded-b-xl shadow-2xl relative z-10 border-t border-gray-300" />
                      <div className="w-[20%] mx-auto h-1 bg-gray-400 rounded-b-md shadow-inner" />
                    </div>
                  ) : (
                    /* Mobile Mockup */
                    <div className="relative w-full max-w-[10rem] sm:max-w-[12rem] aspect-[1/2] rounded-[2rem] border-[6px] sm:border-8 border-gray-900 bg-black overflow-hidden shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                      {project.image_url ? (
                        <img src={project.image_url} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                           <span className="text-white/50 text-center px-4 text-sm">Image Placeholder</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: Project Details */}
                <div className="space-y-6 lg:space-y-8 pt-4">
                  {project.bullet_points && project.bullet_points.length > 0 && (
                    <ul className="space-y-4 list-disc list-outside ml-6 text-gray-200 text-base md:text-lg font-body leading-relaxed marker:text-white/70">
                      {project.bullet_points.map((bp: string, i: number) => (
                        <li key={i}>{bp}</li>
                      ))}
                    </ul>
                  )}

                  <div>
                    <h4 className="text-xl md:text-2xl font-heading text-brand-text mb-4 uppercase tracking-wider">LANGUAGE & TOOLS</h4>
                    <div className="flex flex-wrap gap-3">
                      {project.tech_stack?.map((tech: string, i: number) => (
                        <div key={i} className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-700/80 rounded-full flex items-center justify-center text-xs md:text-sm font-medium text-white shadow-sm border border-white/5">
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {!projects?.length && (
          <p className="text-gray-500 italic text-center pt-8 w-full">No project records.</p>
        )}
      </div>
      
      {/* Scroll Hint / Carousel Indicator */}
      {projects && projects.length > 1 && (
        <div className="flex absolute top-1/2 -translate-y-1/2 w-full justify-between pointer-events-none px-2 lg:px-0 z-30">
          <button 
            onClick={() => scroll('left')} 
            className="pointer-events-auto w-10 h-10 lg:w-12 lg:h-12 bg-black/40 lg:bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white/90 lg:text-white/70 hover:text-white hover:bg-white/20 border border-white/20 lg:-ml-16 transition-colors shadow-lg cursor-pointer"
          >
             <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={2} />
          </button>
          <button 
            onClick={() => scroll('right')} 
            className="pointer-events-auto w-10 h-10 lg:w-12 lg:h-12 bg-black/40 lg:bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white/90 lg:text-white/70 hover:text-white hover:bg-white/20 border border-white/20 lg:-mr-16 transition-colors shadow-lg cursor-pointer animate-pulse lg:animate-none"
          >
             <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={2} />
          </button>
        </div>
      )}

      {/* Scroll Progress Bar for Mobile */}
      {projects && projects.length > 1 && (
        <div className="lg:hidden w-full px-8 mt-4 flex justify-center">
          <div className="w-full max-w-[200px] h-1.5 bg-white/10 rounded-full overflow-hidden relative">
            <div 
              className="absolute top-0 left-0 h-full bg-brand-light-blue transition-all duration-300 ease-out rounded-full"
              style={{ width: `${Math.max(scrollProgress, 15)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
