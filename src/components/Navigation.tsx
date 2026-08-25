"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navigation({ logoUrl }: { logoUrl?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();

  const navLinks = [
    { name: "HOME", id: "home" },
    { name: "ABOUT ME", id: "about" },
    { name: "INVOLVEMENT", id: "involvement" },
    { name: "PROJECT", id: "projects" },
    { name: "K-YOUTH", id: "k-youth" },
  ];

  if (pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'involvement', 'projects', 'k-youth', 'contact'];
      let currentSection = 'home';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          // If we have scrolled past the top of the section (with a 200px buffer)
          if (window.scrollY >= element.offsetTop - 200) {
            currentSection = section;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check immediately on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop, // Removed offset so it aligns exactly with section top
        behavior: "smooth"
      });
      setIsOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-transparent border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="font-heading tracking-wider text-white flex items-center">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-16 w-auto object-contain drop-shadow-lg" />
              ) : (
                <span className="text-4xl">Hadif</span>
              )}
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className={`${
                  activeSection === link.id
                    ? "text-white border-b-2 border-white"
                    : "text-gray-300 hover:text-white"
                } text-sm font-medium tracking-widest px-1 py-2 transition-colors cursor-pointer`}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, 'contact')}
              className={`border border-white px-6 py-2 transition-colors text-sm font-medium tracking-widest cursor-pointer ${
                activeSection === 'contact' 
                ? "bg-white text-brand-blue" 
                : "text-white hover:bg-white hover:text-brand-blue"
              }`}
            >
              CONTACT
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center mr-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-brand-blue/30 backdrop-blur-lg border-b border-white/10 shadow-xl">
          <div className="px-4 pt-4 pb-6 space-y-2 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className={`block px-3 py-2 rounded-md text-base font-medium tracking-widest cursor-pointer ${
                  activeSection === link.id
                    ? "text-white bg-white/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, 'contact')}
              className={`block px-3 py-2 mt-4 text-center border border-white font-medium transition-colors tracking-widest cursor-pointer ${
                activeSection === 'contact'
                  ? "bg-white text-brand-blue"
                  : "text-white hover:bg-white hover:text-brand-blue"
              }`}
            >
              CONTACT
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
