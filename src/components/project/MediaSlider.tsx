"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaItem } from "@/data/types";
import { cn } from "@/lib/cn";
import { padNumber } from "@/lib/project";
import { useImageZoom } from "./useImageZoom";

interface MediaSliderProps {
  slides: MediaItem[];
  label: string;
  note?: string;
}

export function MediaSlider({ slides, label, note }: MediaSliderProps) {
  const isLoop = slides.length > 1;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: isLoop, align: "center", active: isLoop });
  const [selected, setSelected] = useState(0);
  const { openImage, imageZoom } = useImageZoom();
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowLeft") emblaApi?.scrollPrev();
      if (event.key === "ArrowRight") emblaApi?.scrollNext();
    },
    [emblaApi],
  );

  const current = slides[selected];
  const count = slides.length;

  return (
    <section aria-roledescription="carousel" aria-label={label} className="pb-16 lg:pb-24">
      {note && <p className="m-0 mb-4 px-5 text-center text-[13px] leading-relaxed text-muted">{note}</p>}
      <div
        ref={emblaRef}
        data-covers-side-progress
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="overflow-hidden focus-visible:outline-offset-[-2px]"
      >
        <div className="flex touch-pan-y">
          {slides.map((slide, index) => {
            const isCurrent = index === selected;
            return (
              <div
                key={index}
                role="group"
                aria-roledescription="slide"
                aria-label={`${padNumber(index + 1)} / ${padNumber(count)}`}
                className="min-w-0 flex-[0_0_min(1100px,82vw)] pl-4 md:pl-6"
              >
                {/* 버튼은 슬라이드 크기 그대로 두고 안쪽 사진만 줄여서, 양옆 사진의 빈 여백을 눌러도 넘어가게 합니다. */}
                <button
                  ref={(element) => {
                    buttonRefs.current[index] = element;
                  }}
                  type="button"
                  tabIndex={isCurrent ? 0 : -1}
                  aria-label={`${isCurrent ? "이미지 확대" : "이미지 선택"}: ${slide.caption ?? slide.alt}`}
                  aria-haspopup={isCurrent ? "dialog" : undefined}
                  className={cn(
                    "group block w-full border-0 bg-transparent p-0 focus-visible:outline-offset-[-2px]",
                    isCurrent ? "cursor-zoom-in" : "cursor-pointer",
                  )}
                  onClick={(event) => {
                    if (!isCurrent) {
                      emblaApi?.scrollTo(index);
                      return;
                    }
                    openImage({
                      items: slides,
                      index,
                      trigger: event.currentTarget,
                      // 확대 화면에서 넘긴 사진으로 슬라이더도 바로 맞춰, 닫으면 그 사진 자리로 돌아갑니다.
                      onIndexChange: (next) => emblaApi?.scrollTo(next, true),
                      resolveTrigger: (next) => buttonRefs.current[next] ?? null,
                    });
                  }}
                >
                  <span
                    className={cn(
                      "relative block aspect-[55/36] w-full overflow-hidden bg-surface transition-[opacity,scale] duration-500 ease-out-soft",
                      isCurrent ? "opacity-100" : "scale-[0.89] opacity-35 group-hover:opacity-60",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 쓰지 않습니다. */}
                    <img src={slide.src} alt={slide.alt} draggable={false} className="size-full object-contain" />
                    {isCurrent && (
                      <span aria-hidden="true" className="absolute right-3 bottom-3 bg-bg/90 px-2.5 py-1.5 text-xs font-medium text-ink">
                        확대
                      </span>
                    )}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {/* 번호는 캡션 길이에 따라 움직이지 않도록 캡션 아래 한가운데에 고정합니다. */}
      <div className="mt-6 flex flex-col items-center gap-2 px-5 text-center" aria-live="polite">
        {current?.caption && <span className="text-[13px] text-muted">{current.caption}</span>}
        <div className="flex items-center gap-1">
          {isLoop && <ArrowButton direction="prev" onClick={() => emblaApi?.scrollPrev()} />}
          <span className="font-mono text-xs text-muted">
            <span className="text-ink">{padNumber(selected + 1)}</span>
            {" / "}{padNumber(count)}
          </span>
          {isLoop && <ArrowButton direction="next" onClick={() => emblaApi?.scrollNext()} />}
        </div>
      </div>
      {imageZoom}
    </section>
  );
}

function ArrowButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const isNext = direction === "next";
  return (
    <button
      type="button"
      aria-label={isNext ? "다음 이미지" : "이전 이미지"}
      onClick={onClick}
      className="group/arrow cursor-pointer border-0 bg-transparent px-3 py-2 text-base leading-none text-muted transition-colors duration-200 hover:text-accent-ink focus-visible:text-accent-ink"
    >
      <span
        aria-hidden="true"
        className={cn(
          "block transition-[translate] duration-300 ease-out-soft motion-reduce:transition-none",
          isNext ? "group-hover/arrow:translate-x-1" : "group-hover/arrow:-translate-x-1",
        )}
      >
        {isNext ? "→" : "←"}
      </span>
    </button>
  );
}
