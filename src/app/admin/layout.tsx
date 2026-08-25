"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, FileText, Image as ImageIcon, Briefcase, Settings, LogOut, GraduationCap, Mail, Menu, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // If we are on the login page, don't show the sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "About Me", href: "/admin/about", icon: Users },
    { name: "Education", href: "/admin/education", icon: GraduationCap },
    { name: "Experience", href: "/admin/experience", icon: Briefcase },
    { name: "Projects", href: "/admin/projects", icon: FileText },
    { name: "Involvement", href: "/admin/involvement", icon: ImageIcon },
    { name: "K-Youth", href: "/admin/kyouth", icon: Users },
    { name: "Messages", href: "/admin/messages", icon: Mail },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white font-body overflow-hidden">
      
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between h-16 px-4 bg-gray-950 border-b border-white/10 shrink-0">
        <span className="font-heading text-xl tracking-widest text-brand-light-blue">ADMIN PANEL</span>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-gray-300 hover:text-white"
        >
          {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative z-50 w-64 h-full bg-gray-950 border-r border-white/10 flex flex-col transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="hidden md:flex h-20 items-center px-6 border-b border-white/10 shrink-0">
          <span className="font-heading text-2xl tracking-widest text-brand-light-blue">ADMIN PANEL</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? "bg-brand-light-blue/20 text-brand-light-blue" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleSignOut}
            className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
