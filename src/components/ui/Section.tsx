import { cn } from "@/lib/cn";

interface SectionProps {
  id: string;
  eyebrow: string;
  title?: string;
  children: React.ReactNode;
}

export function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="w-full scroll-mt-16 pt-18 pb-28">
      <div data-su>
        <h2
          id={`${id}-heading`}
          className={cn("m-0 text-center text-base font-semibold text-accent", title ? "mb-1.5" : "mb-12")}
        >
          {eyebrow}
        </h2>
        {title && <p className="m-0 mb-12 text-center text-2xl font-semibold text-ink">{title}</p>}
        {children}
      </div>
    </section>
  );
}
