import type { Metadata } from "next";
import Link from "next/link";
import { HISTORY, MAIN_SKILLS, OTHER_SKILLS, PROFILE } from "@/data/profile";
import type { MediaItem, Project, SkillLevel } from "@/data/types";
import { cn } from "@/lib/cn";
import { fullMeta, getVisibleProjects, padNumber, shortMeta } from "@/lib/project";
import { PORTFOLIO_PDF, SITE_URL } from "@/lib/site";
import { PrintScale } from "./PrintScale";

export const metadata: Metadata = {
  title: { absolute: `${PROFILE.name} 포트폴리오` },
  robots: { index: false, follow: false },
};

const LEVEL_TEXT: Record<SkillLevel, string> = { 1: "하", 2: "중하", 3: "중", 4: "중상", 5: "상" };

const bareUrl = (href: string) => href.replace(/^https?:\/\//, "").replace(/\/$/, "");

/**
 * A4 한 쪽. 쪽마다 위에 문서 이름과 지금 보는 내용을 적은 머리말 줄을 둡니다.
 * 내용은 한 쪽 안에 들어가도록 구성했습니다. 넘치면 다음 쪽으로 이어지지만 머리말은 첫 쪽에만 붙습니다.
 */
function Sheet({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="print-sheet">
      <div className="mb-5 flex items-baseline justify-between border-b border-line pb-2.5 text-[10.5px]">
        <span className="font-semibold">{PROFILE.name} 포트폴리오</span>
        <span className="text-muted">{label}</span>
      </div>
      {children}
    </section>
  );
}

/** 쪽 안의 소제목. 아래에 가는 선을 그어 내용과 나눕니다. */
function Heading({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("m-0 mb-3 border-b border-line pb-2 text-[17px] font-semibold", className)}>{children}</h2>;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[84px_minmax(0,1fr)] gap-4 border-b border-line py-2">
      <dt className="text-[11.5px] leading-[1.7] text-muted">{label}</dt>
      <dd className="m-0 min-w-0 text-[12px] leading-[1.65] text-body">{children}</dd>
    </div>
  );
}

function LevelBar({ level }: { level: SkillLevel }) {
  return (
    <span className="flex items-center gap-2" aria-label={`숙련도 5단계 중 ${level}단계`}>
      <span className="flex gap-[3px]">
        {[1, 2, 3, 4, 5].map((step) => (
          <span key={step} className={cn("h-[5px] w-4", step <= level ? "bg-accent" : "bg-line")} />
        ))}
      </span>
      <span className="text-[10.5px] text-muted">{LEVEL_TEXT[level]}</span>
    </span>
  );
}

function Shot({ item, className }: { item: MediaItem; className: string }) {
  return (
    <figure className="m-0">
      {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 쓰지 않습니다. */}
      <img src={item.src} alt={item.alt} className={cn("block w-full bg-surface object-contain", className)} />
      {item.caption && <figcaption className="mt-1 text-[10.5px] text-muted">{item.caption}</figcaption>}
    </figure>
  );
}

/** 성과 숫자를 연한 주황 바탕에 크게 보여줍니다. */
function MetricHighlight({ project }: { project: Project }) {
  if (project.metrics.length === 0) return null;
  return (
    <div className="mb-5">
      <dl className="m-0 flex border-l-[3px] border-accent bg-accent/[0.07] py-3">
        {project.metrics.map((metric, i) => (
          <div key={metric.label} className={cn("flex flex-1 flex-col-reverse gap-0.5 px-5", i > 0 && "border-l border-accent/25")}>
            <dt className="text-[11.5px] text-body">{metric.label}</dt>
            <dd className="m-0 text-[26px] leading-[1.25] font-semibold tracking-[-0.03em]">{metric.value}</dd>
          </div>
        ))}
      </dl>
      {project.metricNote && <p className="m-0 mt-1.5 text-[10.5px] leading-[1.6] text-muted">{project.metricNote}</p>}
    </div>
  );
}

/** 첫 장을 크게, 나머지는 아래 한 줄에 나란히 둡니다. */
function Gallery({ media, note }: { media: MediaItem[]; note?: string }) {
  if (media.length === 0) return null;
  const [main, ...rest] = media;
  return (
    <div className="mb-5">
      <Shot item={main} className="aspect-[3/1]" />
      {rest.length > 0 && (
        <div className={cn("mt-2.5 grid gap-2.5", rest.length >= 3 ? "grid-cols-3" : "grid-cols-2")}>
          {rest.map((item) => (
            <Shot key={item.src} item={item} className={rest.length >= 3 ? "aspect-[16/9]" : "aspect-[8/3]"} />
          ))}
        </div>
      )}
      {note && <p className="m-0 mt-1.5 text-[10.5px] text-muted">{note}</p>}
    </div>
  );
}

function ProjectSheets({ project }: { project: Project }) {
  const roleDetail = project.roleDetail ?? project.role;
  return (
    <>
      <Sheet label={`${project.title} · 개요`}>
        <header className="mb-4">
          {project.badge && <p className="m-0 mb-1 text-[12.5px] font-semibold text-accent-ink">{project.badge}</p>}
          <h1 className="m-0 text-[28px] leading-[1.3] font-semibold tracking-[-0.035em]">{project.title}</h1>
          <p className="m-0 mt-1 text-[12px] text-muted">{fullMeta(project)}</p>
        </header>
        <MetricHighlight project={project} />
        <Gallery media={project.media ?? []} note={project.mediaNote} />
        <Heading>개요</Heading>
        <dl className="m-0">
          <Row label="소개">
            <span className="text-ink">{project.summary}</span>
          </Row>
          {roleDetail && <Row label="맡은 일">{roleDetail}</Row>}
          {project.stack.length > 0 && (
            <Row label="사용 기술">
              <span className="font-semibold text-ink">{project.stack.join(" · ")}</span>
              {project.stackNote && <span className="mt-1 block">{project.stackNote}</span>}
            </Row>
          )}
          {(project.links.length > 0 || project.note) && (
            <Row label="링크">
              {project.links.map((link) => (
                <a key={link.href} href={link.href} className="mr-5 text-accent-ink underline underline-offset-2">
                  {link.label} · {bareUrl(link.href)}
                </a>
              ))}
              {project.note && <span className="text-[11.5px] text-muted">{project.note}</span>}
            </Row>
          )}
        </dl>
      </Sheet>

      {(project.steps.length > 0 || project.ps) && (
        <Sheet label={`${project.title} · 문제 해결`}>
          <p className="m-0 text-[12.5px] font-semibold text-accent-ink">{project.title}</p>
          <h1 className="m-0 mb-4 text-[28px] leading-[1.3] font-semibold tracking-[-0.035em]">문제 해결</h1>
          <ol className="m-0 list-none divide-y divide-line p-0">
            {project.steps.map((step, i) => (
              <li key={i} className="print-avoid grid grid-cols-[36px_minmax(0,1fr)] py-3 first:pt-0 last:pb-0">
                <span className="pt-1 font-mono text-[12px] text-accent-ink">{padNumber(i + 1)}</span>
                <div>
                  <h3 className="m-0 text-[15.5px] leading-[1.45] font-semibold">{step.title}</h3>
                  <p className="m-0 mt-1 text-[12.5px] leading-[1.65] whitespace-pre-line text-body">
                    {step.lead}
                    {step.strong && <span className="font-semibold text-ink">{step.strong}</span>}
                    {step.tail}
                  </p>
                  {step.result && (
                    <p className="m-0 mt-1.5 text-[12px] text-ink">
                      <span className="text-accent-ink">→</span> {step.result}
                    </p>
                  )}
                  {step.image && <Shot item={step.image} className="mt-2.5 w-[60%]" />}
                </div>
              </li>
            ))}
          </ol>
          {project.ps && (
            <div className="print-avoid mt-6">
              <Heading>회고</Heading>
              <p className="m-0 text-[12.5px] leading-[1.75] text-body">{project.ps}</p>
              {project.retroMedia && (
                <div className="mt-3 w-[72%]">
                  <Shot item={project.retroMedia} className="" />
                </div>
              )}
            </div>
          )}
        </Sheet>
      )}
    </>
  );
}

/**
 * PDF와 같은 모양의 미리보기 페이지. 소개·경력·프로젝트 목록, 기술·교육에 이어 프로젝트마다 개요와 문제 해결을 한 쪽씩 보여줍니다.
 * 메인의 "포트폴리오 PDF" 링크가 이 페이지를 엽니다. 브라우저마다 PDF를 열지 내려받을지가 달라, 어디서든 보이도록 웹페이지로 보여줍니다.
 * `npm run pdf`도 이 페이지를 A4 PDF로 저장합니다. 위쪽 도구 줄은 PDF와 인쇄에는 나오지 않습니다.
 */
export default function PrintPage() {
  const projects = getVisibleProjects();
  const career = HISTORY.find((group) => group.label === "경력")?.items ?? [];
  const studies = HISTORY.filter((group) => group.label !== "경력");
  const siteUrl = SITE_URL.includes("localhost") ? null : SITE_URL;
  const contacts = [
    { text: PROFILE.email, href: `mailto:${PROFILE.email}` },
    { text: bareUrl(PROFILE.github), href: PROFILE.github },
    ...(siteUrl ? [{ text: bareUrl(siteUrl), href: siteUrl }] : []),
  ];

  return (
    <>
      <nav aria-label="PDF 미리보기" className="print-hide sticky top-0 z-10 border-b border-black/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[calc(210mm+32px)] items-center justify-between gap-4 px-4 py-3 text-[14px] text-[#111]">
          <Link href="/" className="transition-colors hover:text-[#c43b0b] focus-visible:text-[#c43b0b]">
            ← 사이트로 돌아가기
          </Link>
          <a
            href={PORTFOLIO_PDF.href}
            download={PORTFOLIO_PDF.fileName}
            className="bg-[#111] px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#c43b0b] focus-visible:bg-[#c43b0b]"
          >
            PDF 내려받기 ↓
          </a>
        </div>
      </nav>
      <PrintScale />
      <main className="print-doc">
        <Sheet label="소개 및 프로젝트">
          <header className="mb-8 pt-2">
            <span aria-hidden="true" className="mb-5 block h-[3px] w-11 bg-accent" />
            <h1 className="m-0 text-[36px] leading-[1.3] font-semibold tracking-[-0.035em]">
              {PROFILE.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="m-0 mt-4 text-[14px] leading-[1.7] text-body">
              {PROFILE.heroLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <p className="m-0 mt-4 flex flex-wrap gap-x-7 text-[12.5px]">
              {contacts.map((contact) => (
                <a key={contact.href} href={contact.href} className="text-accent-ink underline underline-offset-2">
                  {contact.text}
                </a>
              ))}
            </p>
          </header>

          <Heading>경력</Heading>
          {career.map((item) => (
            <div key={item.title} className="mb-8 grid grid-cols-[132px_minmax(0,1fr)] gap-3">
              <span className="pt-0.5 font-mono text-[11px] text-muted">{item.period}</span>
              <div>
                <h3 className="m-0 text-[15px] font-semibold">{item.title}</h3>
                {item.subtitle && <p className="m-0 mt-0.5 text-[12.5px] text-muted">{item.subtitle}</p>}
                {item.details && (
                  <ul className="m-0 mt-2 list-none p-0">
                    {item.details.map((detail) => (
                      <li key={detail} className="flex gap-2.5 text-[12.5px] leading-[1.75] text-body">
                        <span aria-hidden="true" className="mt-[9px] size-[5px] shrink-0 rounded-full bg-accent" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}

          <Heading>프로젝트</Heading>
          <ol className="m-0 list-none p-0">
            {projects.map((project, i) => {
              const thumb = project.hoverPreview ?? project.media?.[0];
              return (
                <li key={project.slug} className="grid grid-cols-[32px_minmax(0,1fr)_168px] items-start gap-3 border-b border-line py-3 first:pt-1">
                  <span className="pt-1 font-mono text-[12px] text-accent-ink">{padNumber(i + 1)}</span>
                  <div>
                    <h3 className="m-0 text-[16px] font-semibold">{project.title}</h3>
                    <p className="m-0 mt-0.5 text-[11.5px] text-muted">
                      {[shortMeta(project), project.badge].filter(Boolean).join(" · ")}
                    </p>
                    {project.highlight && <p className="m-0 mt-1.5 text-[12.5px] leading-[1.65] text-body">{project.highlight}</p>}
                  </div>
                  {thumb && (
                    // eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 쓰지 않습니다.
                    <img src={thumb.src} alt={thumb.alt} className="block aspect-[3/2] w-full bg-surface object-contain" />
                  )}
                </li>
              );
            })}
          </ol>
        </Sheet>

        <Sheet label="기술 · 교육 및 자격">
          <Heading>주력 기술</Heading>
          <dl className="m-0 mb-8 grid grid-cols-2 gap-x-7">
            {MAIN_SKILLS.map((skill) => (
              <div key={skill.name} className="border-b border-line py-3">
                <dt className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 쓰지 않습니다. */}
                  <img src={skill.icon} alt="" width={34} height={34} className="size-[34px] shrink-0 object-contain" />
                  <span className="flex flex-col gap-1">
                    <span className="text-[15px] leading-none font-semibold">{skill.name}</span>
                    <LevelBar level={skill.level} />
                  </span>
                </dt>
                <dd className="m-0 mt-2 text-[12px] leading-[1.65] text-body">{skill.note}</dd>
              </div>
            ))}
          </dl>

          <Heading>그 외 사용해 본 기술</Heading>
          <dl className="m-0 mb-8 grid grid-cols-2 gap-x-7">
            {OTHER_SKILLS.map((group) => (
              <div key={group.label} className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 border-b border-line py-2">
                <dt className="text-[11.5px] leading-[1.75] text-muted">{group.label}</dt>
                <dd className="m-0 text-[12.5px] leading-[1.65]">{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>

          <Heading>교육 및 자격</Heading>
          {studies.map((group) => (
            <div key={group.label} className="mb-3 border-b border-line pb-2 last:border-b-0">
              <h3 className="m-0 mb-1.5 text-[11.5px] font-semibold text-accent-ink">{group.label}</h3>
              <ul className="m-0 list-none p-0">
                {group.items.map((item) => (
                  <li key={item.title} className="grid grid-cols-[132px_minmax(0,1fr)] gap-3 py-1.5">
                    <span className="pt-0.5 font-mono text-[11px] text-muted">{item.period}</span>
                    <div>
                      <p className="m-0 flex flex-wrap items-baseline gap-x-2.5">
                        <span className="text-[14px] font-semibold">{item.title}</span>
                        {item.status && <span className="text-[11px] font-semibold text-accent-ink">{item.status}</span>}
                      </p>
                      {item.subtitle && <p className="m-0 mt-0.5 text-[12px] text-muted">{item.subtitle}</p>}
                      {item.details && (
                        <ul className="m-0 mt-1 list-none p-0">
                          {item.details.map((detail) => (
                            <li key={detail} className="flex gap-2.5 text-[12px] leading-[1.7] text-body">
                              <span aria-hidden="true" className="mt-[8px] size-[5px] shrink-0 rounded-full bg-accent" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Sheet>

        {projects.map((project) => (
          <ProjectSheets key={project.slug} project={project} />
        ))}
      </main>
    </>
  );
}
