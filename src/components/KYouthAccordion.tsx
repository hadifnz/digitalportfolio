"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function KYouthAccordion({ scenarios }: { scenarios: any[] }) {
  // Start with the first one open (optional) or all closed. Let's start all closed.
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full space-y-6">
      {scenarios?.map((scenario: any) => {
        const isOpen = openId === scenario.id;
        
        return (
          <div key={scenario.id} className="bg-white rounded-[2rem] overflow-hidden shadow-xl transition-all duration-300 relative group border border-white/20">
             
             {/* Inner border decoration mimicking the screenshot */}
             <div className="absolute inset-2 border border-brand-light-blue/40 rounded-[1.5rem] pointer-events-none" />

             {/* Header */}
             <button 
               onClick={() => toggle(scenario.id)}
               className="w-full px-8 py-10 flex justify-center items-center bg-white hover:bg-blue-50/50 transition-colors relative z-10"
             >
                <h3 className="text-4xl md:text-6xl font-heading text-brand-light-blue text-center uppercase tracking-wider relative flex items-center justify-center w-full">
                  {scenario.scenario_title}
                  <ChevronDown className={`absolute right-0 w-8 h-8 md:w-12 md:h-12 text-brand-light-blue transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </h3>
             </button>
             
             {/* Content */}
             <div className={`relative z-10 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-8 pb-12 pt-4">
                  {scenario.description && (
                    <p className="text-gray-800 text-center text-lg md:text-xl font-body leading-relaxed max-w-4xl mx-auto mb-12 whitespace-pre-wrap">
                      {scenario.description}
                    </p>
                  )}

                  {/* Folder Icons */}
                  <div className="flex justify-center gap-8 md:gap-16 flex-wrap">
                    {scenario.documents?.map((doc: any, i: number) => (
                      <a 
                        key={i} 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center group/folder cursor-pointer"
                        title={`Open ${doc.name}`}
                      >
                        <div className="relative w-24 h-20 md:w-32 md:h-24 bg-brand-light-blue rounded-lg rounded-tl-none shadow-lg group-hover/folder:-translate-y-2 transition-transform">
                          {/* Folder Tab */}
                          <div className="absolute -top-3 left-0 w-1/3 h-4 bg-brand-light-blue rounded-t-lg"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-brand-blue font-bold tracking-wider text-sm md:text-base text-center px-2">{doc.name}</span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
             </div>
          </div>
        );
      })}

      {!scenarios?.length && (
        <p className="text-gray-500 italic text-center">No K-Youth scenarios found.</p>
      )}
    </div>
  );
}
