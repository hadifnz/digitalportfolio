import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: 'swap' });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald", display: 'swap' });

import Navigation from "@/components/Navigation";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Portfolio | Muhammad Hadif",
  description: "Digital Portfolio of Muhammad Hadif",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data: settings } = await supabase.from('site_settings').select('logo_url, hero_bg_url').limit(1).single();

  return (
    <html lang="en">
      {/* We add our global font classes here. The custom fonts are loaded via globals.css */}
      <body className={`${inter.variable} ${oswald.variable} font-body bg-brand-blue text-brand-text antialiased min-h-screen relative`}>
        {/* Global Background */}
        {settings?.hero_bg_url ? (
          <div 
            className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-50"
            style={{ backgroundImage: `url(${settings.hero_bg_url})` }}
          >
            {/* Dimmer overlay for global background */}
            <div className="absolute inset-0 bg-black/[0.15]" />
          </div>
        ) : (
          <div className="fixed inset-0 bg-silk-texture bg-cover bg-center -z-50" />
        )}

        <Navigation logoUrl={settings?.logo_url} />
        
        {/* The content wrapper doesn't push down via pt-20 anymore because Navigation is transparent, but we still need some padding for content pages. We'll handle top padding inside sections or global content wrapper. */}
        <div className="relative z-0">
          {children}
        </div>
      </body>
    </html>
  );
}
