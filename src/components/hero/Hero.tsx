import { ChevronDownIcon } from "@/components/ui/icons";
import { PROFILE } from "@/data/profile";
import { HERO_ID } from "@/lib/site";

const BLOB = "pointer-events-none absolute rounded-full blur-[100px] motion-reduce:animate-none";
const RISE = "relative z-10 animate-rise motion-reduce:animate-none";

export function Hero() {
  return (
    <div
      id={HERO_ID}
      // 기존 사이트는 content-box라 최소 높이에 위아래 패딩(96 + 120px)이 더해졌습니다.
      className="relative flex min-h-[calc(clamp(560px,76vh,960px)+216px)] w-full flex-col items-center justify-center pt-24 pb-30"
    >
      {/* main의 최대 폭을 넘어 화면 전체로 퍼지는 배경 */}
      <div aria-hidden="true" className="absolute -top-16 bottom-0 left-1/2 z-0 w-screen -translate-x-1/2 overflow-hidden">
        <div className={`${BLOB} top-[-14%] left-[4%] size-[min(600px,68vw)] animate-drift-a bg-[rgb(17_119_207/.22)]`} />
        <div className={`${BLOB} top-[6%] right-[2%] size-[min(580px,66vw)] animate-drift-b bg-[rgb(108_184_234/.3)]`} />
        <div className={`${BLOB} bottom-[-18%] left-[30%] size-[min(500px,58vw)] animate-drift-c bg-[rgb(199_230_250/.5)]`} />
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[46%] bg-linear-to-b from-transparent via-bg via-82% to-bg" />
      </div>

      <h1
        className={`${RISE} m-0 w-full px-2 py-6 text-center text-[clamp(30px,4.4vw,46px)] leading-[1.2] font-bold text-ink [animation-delay:.4s]`}
      >
        안녕하세요,
        <br />
        {PROFILE.role}
        <br />
        <em className="text-accent not-italic">{PROFILE.name}</em>입니다.
      </h1>

      <p className={`${RISE} m-0 mt-2 text-center text-base leading-[1.75] text-body [animation-delay:1.2s]`}>
        {PROFILE.heroLines[0]}
        <br />
        {PROFILE.heroLines[1]}
      </p>

      <div className={`${RISE} mt-11 flex justify-center [animation-delay:1.6s]`}>
        <a
          href="#experience"
          aria-label="아래로 스크롤"
          className="flex size-12 items-center justify-center rounded-full text-accent hover:text-ink"
        >
          <span className="flex animate-scroll-hint leading-none motion-reduce:animate-none">
            <ChevronDownIcon />
          </span>
        </a>
      </div>
    </div>
  );
}
