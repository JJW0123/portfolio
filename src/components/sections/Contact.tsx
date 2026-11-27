import { Section } from "@/components/layout/Section";
import { PROFILE } from "@/data/profile";
import { PORTFOLIO_PDF } from "@/lib/site";

export function Contact() {
  const rows: { label: string; text: string; href: string; download?: string }[] = [
    { label: "이메일", text: PROFILE.email, href: `mailto:${PROFILE.email}` },
    { label: "GitHub", text: PROFILE.github.replace("https://", ""), href: PROFILE.github },
    { label: "포트폴리오", text: "PDF 내려받기 ↓", href: PORTFOLIO_PDF.href, download: PORTFOLIO_PDF.fileName },
  ];

  return (
    <Section id="contact" num="05" title="연락처" className="contact-reveal [&>div]:pb-16 lg:[&>div]:pb-24">
      <ul className="m-0 list-none p-0">
        {rows.map((row) => (
          <li key={row.label} className="grid gap-1 border-b border-line py-4 md:grid-cols-[200px_minmax(0,1fr)] md:items-baseline md:gap-10">
            <span className="text-sm text-muted">{row.label}</span>
            <a
              href={row.href}
              download={row.download}
              {...(row.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="min-w-0 justify-self-start text-lg [overflow-wrap:anywhere] transition-colors hover:text-accent-ink focus-visible:text-accent-ink"
            >
              {row.text}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
