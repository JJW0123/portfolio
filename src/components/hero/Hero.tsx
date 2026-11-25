import { PROFILE } from "@/data/profile";
import { DotGrid } from "./DotGrid";
import { HeroSnap } from "./HeroSnap";
import { SplitHeadline } from "./SplitHeadline";

export function Hero() {
  return (
    <div id="top" className="relative min-h-[100svh] overflow-hidden">
      <DotGrid />
      <HeroSnap />
      <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-5 pt-32 pb-12 md:px-10 lg:px-20 lg:pb-[88px]">
        <SplitHeadline lines={PROFILE.headline} />
        <p className="m-0 mt-8 max-w-[620px] text-[clamp(16px,1.4vw,19px)] leading-[1.6] text-muted">
          {PROFILE.heroLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-[15px]">
          <a href={`mailto:${PROFILE.email}`} className="transition-colors hover:text-accent-ink focus-visible:text-accent-ink">
            {PROFILE.email} <span aria-hidden="true">↗</span>
          </a>
          <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent-ink focus-visible:text-accent-ink">
            {PROFILE.github.replace("https://", "")} <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="mt-14 flex justify-between text-[13px] text-muted">
          <a href="#career" className="transition-colors hover:text-accent-ink focus-visible:text-accent-ink">
            아래로 스크롤 ↓
          </a>
          <span className="font-mono">Portfolio 2026</span>
        </div>
      </div>
    </div>
  );
}
