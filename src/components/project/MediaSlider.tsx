"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
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
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="overflow-hidden focus-visible:outline-offset-[-2px]"
      >
        <div className="flex touch-pan-y">
          {slides.map((slide, index) => {
            const isCurrent = index === selected;
            const isNext = index === (selected + 1) % count;
            return (
              <div
                key={index}
                role="group"
                aria-roledescription="slide"
                aria-label={`${padNumber(index + 1)} / ${padNumber(count)}`}
                className="group relative min-w-0 flex-[0_0_min(1100px,82vw)] pl-4 md:pl-6"
              >
                <button
                  type="button"
                  tabIndex={isCurrent ? 0 : -1}
                  aria-label={`${isCurrent ? "이미지 확대" : "이미지 선택"}: ${slide.caption ?? slide.alt}`}
                  aria-haspopup={isCurrent ? "dialog" : undefined}
                  className={cn(
                    "relative block aspect-[55/36] w-full overflow-hidden border-0 bg-surface p-0 transition-[opacity,transform] duration-500 ease-out-soft focus-visible:outline-offset-[-2px]",
                    isCurrent ? "cursor-zoom-in opacity-100" : "scale-[0.89] cursor-pointer opacity-35",
                  )}
                  onClick={(event) => {
                    if (!isCurrent) {
                      emblaApi?.scrollTo(index);
                      return;
                    }
                    openImage(slide, event.currentTarget);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 쓰지 않습니다. */}
                  <img src={slide.src} alt={slide.alt} draggable={false} className="size-full object-contain" />
                  {isCurrent && (
                    <span aria-hidden="true" className="absolute right-3 bottom-3 bg-bg/90 px-2.5 py-1.5 text-xs font-medium text-ink">
                      확대
                    </span>
                  )}
                </button>
                {!isCurrent && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-lg text-on-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                      isNext ? "left-10 md:left-12" : "right-6",
                    )}
                  >
                    {isNext ? "→" : "←"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* 번호는 캡션 길이에 따라 움직이지 않도록 캡션 아래 한가운데에 고정합니다. */}
      <div className="mt-6 flex flex-col items-center gap-2 px-5 text-center" aria-live="polite">
        {current?.caption && <span className="text-[13px] text-muted">{current.caption}</span>}
        <span className="font-mono text-xs text-muted">
          <span className="text-ink">{padNumber(selected + 1)}</span>
          {" / "}{padNumber(count)}
        </span>
      </div>
      {imageZoom}
    </section>
  );
}
