"use client";

import { useEffect, useRef } from "react";
import FadeIn from "./FadeIn";
import { smoothScrollBy } from "@/utils/smoothScroll";

export default function InvolvementGrid({ involvements }: { involvements: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          // Trigger nudge after 2 seconds
          setTimeout(() => {
            if (scrollRef.current) {
              // Nudge right (800ms duration for slower visible animation)
              smoothScrollBy(scrollRef.current, 80, 800);

              // Nudge back after scroll completes + short pause
              setTimeout(() => {
                if (scrollRef.current) {
                  smoothScrollBy(scrollRef.current, -80, 800);
                }
              }, 1200);
            }
          }, 2000);
          
          observer.disconnect(); // only do it once
        }
      },
      { threshold: 0.5 }
    );

    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={scrollRef}
      className="grid grid-rows-2 grid-flow-col auto-cols-[75vw] overflow-x-auto snap-x snap-mandatory gap-4 pb-8 md:grid-rows-none md:grid-flow-row md:grid-cols-2 lg:grid-cols-4 md:auto-cols-auto md:overflow-visible md:snap-none w-full custom-scrollbar"
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
            <div className="overflow-y-auto flex-grow pr-1 custom-scrollbar">
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
  );
}
