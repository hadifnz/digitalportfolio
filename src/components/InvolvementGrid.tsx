"use client";

import { useRef } from "react";
import FadeIn from "./FadeIn";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function InvolvementGrid({ involvements }: { involvements: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full group/carousel">
      <div
        ref={scrollRef}
        className="grid grid-rows-2 grid-flow-col auto-cols-[75vw] md:auto-cols-[40%] lg:auto-cols-[23%] overflow-x-auto snap-x snap-mandatory gap-4 pb-8 w-full scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
      {involvements?.map((inv: any, idx: number) => (
        <FadeIn
          key={inv.id}
          delay={0.3 + idx * 0.1}
          direction="up"
          className="group relative snap-start w-full aspect-square bg-white/5 border border-white/10 overflow-hidden cursor-pointer hover:border-brand-light-blue transition-colors"
        >
          <div className="absolute inset-0 p-4 sm:p-6 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity bg-brand-blue/90 z-20">
            <div className="shrink-0 mb-2 sm:mb-4">
              <span className="text-brand-light-blue font-heading text-lg sm:text-xl">{inv.year}</span>
              <h3 className="text-white font-bold text-sm sm:text-lg mt-1 sm:mt-2 leading-tight">{inv.title}</h3>
              <p className="text-white/80 text-xs sm:text-sm mt-1 line-clamp-2 sm:line-clamp-none">{inv.organization}</p>
            </div>
            <div className="overflow-y-auto flex-grow pr-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              <p className="text-gray-300 text-xs sm:text-sm">{inv.description}</p>
            </div>
          </div>

          {inv.image_url ? (
            <img
              src={inv.image_url}
              alt={inv.title}
              className="absolute inset-0 w-full h-full object-cover z-0 group-hover:opacity-20 transition-opacity"
            />
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

      {/* Scroll Arrows for Desktop */}
      {involvements && involvements.length > 2 && (
        <div className="hidden lg:flex absolute top-[calc(50%-1rem)] -translate-y-1/2 w-[calc(100%+6rem)] -left-12 justify-between pointer-events-none">
          <button 
            onClick={() => scroll('left')} 
            className="pointer-events-auto w-12 h-12 bg-white/5 backdrop-blur rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 border border-white/10 transition-colors cursor-pointer opacity-0 group-hover/carousel:opacity-100"
          >
             <ChevronLeft className="w-6 h-6" strokeWidth={2} />
          </button>
          <button 
            onClick={() => scroll('right')} 
            className="pointer-events-auto w-12 h-12 bg-white/5 backdrop-blur rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 border border-white/10 transition-colors cursor-pointer opacity-0 group-hover/carousel:opacity-100"
          >
             <ChevronRight className="w-6 h-6" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}
