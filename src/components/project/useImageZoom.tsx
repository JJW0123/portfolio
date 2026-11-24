"use client";

import { useRef, useState } from "react";
import type { MediaItem } from "@/data/types";
import { cn } from "@/lib/cn";

export function useImageZoom() {
  const [zoomed, setZoomed] = useState<{ media: MediaItem; originalSize: boolean } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function openImage(media: MediaItem, trigger: HTMLButtonElement, originalSize = false) {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    triggerRef.current = trigger;
    setZoomed({ media, originalSize });
    dialog.showModal();
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
      contentRef.current.scrollLeft = 0;
    }
  }

  const imageZoom = (
    <dialog
      ref={dialogRef}
      aria-label="이미지 확대 보기"
      className="project-image-zoom fixed inset-0 m-auto max-h-[100dvh] w-full max-w-[960px] overflow-hidden border-0 bg-bg p-0 text-ink backdrop:bg-black/75 md:max-h-[92dvh]"
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      onKeyDown={(event) => {
        // Esc와 Tab은 바깥 프로젝트 패널 대신 네이티브 다이얼로그에 맡깁니다.
        event.stopPropagation();
      }}
      onClose={() => {
        setZoomed(null);
        triggerRef.current?.focus({ preventScroll: true });
      }}
    >
      <div className="flex max-h-[100dvh] flex-col md:max-h-[92dvh]">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-4 py-2 md:px-6">
          <p className="m-0 text-sm font-medium">{zoomed?.media.caption ?? zoomed?.media.alt}</p>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="min-h-11 shrink-0 cursor-pointer border-0 bg-transparent px-2 text-sm text-ink"
          >
            닫기
          </button>
        </div>
        <div ref={contentRef} tabIndex={0} className="min-h-0 overflow-auto overscroll-contain px-4 py-3 md:px-6">
          {zoomed && (
            // eslint-disable-next-line @next/next/no-img-element -- 확대 화면에서는 원본을 표시합니다.
            <img
              src={zoomed.media.src}
              alt={zoomed.media.alt}
              className={cn("mx-auto block h-auto w-auto", zoomed.originalSize ? "max-w-none" : "max-w-full")}
            />
          )}
        </div>
      </div>
    </dialog>
  );

  return { openImage, imageZoom };
}
