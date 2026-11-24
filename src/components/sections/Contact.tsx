import { Section } from "@/components/layout/Section";
import { PROFILE } from "@/data/profile";

export function Contact() {
  const rows = [
    { label: "이메일", text: PROFILE.email, href: `mailto:${PROFILE.email}` },
    { label: "GitHub", text: PROFILE.github.replace("https://", ""), href: PROFILE.github },
  ];

  return (
    <Section id="contact" num="05" title="연락처" className="contact-reveal [&>div]:pb-16 lg:[&>div]:pb-24">
      <ul className="m-0 list-none p-0">
        {rows.map((row) => (
          <li key={row.label} className="grid gap-1 border-b border-line py-4 md:grid-cols-[200px_minmax(0,1fr)] md:items-baseline md:gap-10">
            <span className="text-sm text-muted">{row.label}</span>
            <a
              href={row.href}
              {...(row.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="min-w-0 justify-self-start text-lg [overflow-wrap:anywhere] transition-colors hover:text-accent"
            >
              {row.text}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
