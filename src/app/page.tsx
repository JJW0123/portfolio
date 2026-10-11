import { Header } from "@/components/header/Header";
import { Hero } from "@/components/hero/Hero";
import { ProjectDrawer } from "@/components/project/ProjectDrawer";
import { ProjectDrawerProvider } from "@/components/project/ProjectDrawerContext";
import { RevealObserver } from "@/components/RevealObserver";
import { Contact } from "@/components/sections/Contact";
import { History } from "@/components/sections/History";
import { ProjectList } from "@/components/sections/ProjectList";
import { Skills } from "@/components/sections/Skills";
import { getVisibleProjects } from "@/lib/project";

export default function HomePage() {
  const projects = getVisibleProjects();

  return (
    <ProjectDrawerProvider projects={projects}>
      <Header />
      <main className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-[clamp(20px,3vw,40px)]">
        <Hero />
        <History />
        <ProjectList projects={projects} />
        <Skills />
        <Contact />
      </main>
      <ProjectDrawer />
      <RevealObserver />
    </ProjectDrawerProvider>
  );
}
