import { Header } from "@/components/header/Header";
import { Hero } from "@/components/hero/Hero";
import { ProjectDrawer } from "@/components/project/ProjectDrawer";
import { ProjectDrawerProvider } from "@/components/project/ProjectDrawerContext";
import { RevealObserver } from "@/components/RevealObserver";
import { Contact } from "@/components/sections/Contact";
import { Education } from "@/components/sections/Education";
import { Experience } from "@/components/sections/Experience";
import { ProjectList } from "@/components/sections/ProjectList";
import { Skills } from "@/components/sections/Skills";
import { Strengths } from "@/components/sections/Strengths";
import { getVisibleProjects } from "@/lib/project";

export default function HomePage() {
  const projects = getVisibleProjects();

  return (
    <ProjectDrawerProvider projects={projects}>
      <Header />
      <main className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-[clamp(20px,3vw,40px)]">
        <Hero />
        <Strengths />
        <Experience />
        <ProjectList projects={projects} />
        <Skills />
        <Education />
        <Contact />
      </main>
      <ProjectDrawer />
      <RevealObserver />
    </ProjectDrawerProvider>
  );
}
