import { Hero } from "@/components/hero/Hero";
import { Footer } from "@/components/layout/Footer";
import { ProjectPanel } from "@/components/project/ProjectPanel";
import { SideProgress } from "@/components/layout/SideProgress";
import { TopBar } from "@/components/layout/TopBar";
import { Career } from "@/components/sections/Career";
import { Contact } from "@/components/sections/Contact";
import { Education } from "@/components/sections/Education";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { getVisibleProjects } from "@/lib/project";
import { HOME_SECTIONS } from "@/lib/site";

export default function HomePage() {
  const projects = getVisibleProjects();
  return (
    <>
      <div id="home-content">
        <TopBar />
        <main>
          <Hero />
          <Career />
          <Projects projects={projects} />
          <Skills />
          <Education />
          <Contact />
        </main>
        <Footer />
        <SideProgress sections={HOME_SECTIONS} />
      </div>
      <ProjectPanel projects={projects} backgroundId="home-content" />
    </>
  );
}
