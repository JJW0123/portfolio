import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header/Header";
import { ProjectDetail, ProjectHeader, ProjectPager } from "@/components/project/ProjectDetail";
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

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const projects = getVisibleProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0) notFound();

  const project = projects[index];
  const { prev, next } = getNeighbors(projects, index);

  return (
    <>
      <Header isHome={false} />
      <main className="mx-auto w-full max-w-[720px] px-3 pt-6 pb-16">
        <Link href="/#project" className="mb-4 inline-flex text-sm font-semibold">
          ← 전체 프로젝트
        </Link>
        <article className="overflow-hidden rounded-xl border border-line bg-bg">
          <ProjectHeader project={project} titleLevel={1} />
          <ProjectDetail project={project} titleLevel={1} />
          <ProjectPager prev={prev} next={next} />
        </article>
      </main>
    </>
  );
}
