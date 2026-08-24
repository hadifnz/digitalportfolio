import HomeSection from "@/components/HomeSection";
import AboutSection from "@/components/AboutSection";
import InvolvementSection from "@/components/InvolvementSection";
import ProjectsSection from "@/components/ProjectsSection";
import KYouthSection from "@/components/KYouthSection";
import ContactSection from "@/components/ContactSection";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between w-full">
      <HomeSection />
      <AboutSection />
      <InvolvementSection />
      <ProjectsSection />
      <KYouthSection />
      <ContactSection />
    </main>
  );
}
