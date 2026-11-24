import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { ProjectDetailView } from "@/components/project/ProjectDetailView";
import { findProject, getNeighbors, getVisibleProjects } from "@/lib/project";
import { OG_IMAGE } from "@/lib/site";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getVisibleProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};
  const path = `/projects/${project.slug}/`;
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: path },
    // openGraph는 layout 값과 병합되지 않고 통째로 대체되므로 이미지를 다시 지정합니다.
    openGraph: { type: "article", title: project.title, description: project.summary, url: path, images: [OG_IMAGE] },
  };
}

/** 주소로 바로 들어오거나 새로고침했을 때 보이는 단독 상세 페이지. 메인에서 누르면 같은 내용이 패널로 열립니다. */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const projects = getVisibleProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0) notFound();

  const { prev, next } = getNeighbors(projects, index);

  return (
    <>
      <TopBar isHome={false} />
      <main id="top" className="pt-[72px]">
        <ProjectDetailView project={projects[index]} prev={prev} next={next} />
      </main>
    </>
  );
}
