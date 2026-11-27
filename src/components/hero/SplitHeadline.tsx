"use client";

import { useEffect, useRef } from "react";

export function SplitHeadline({ lines }: { lines: readonly string[] }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animations = Array.from(heading.querySelectorAll<HTMLElement>("[data-headline-word]"), (word, index) =>
      word.animate([{ transform: "translateY(105%)" }, { transform: "translateY(0)" }], {
        duration: 800,
        delay: index * 50,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards",
      }),
    );
    return () => animations.forEach((animation) => animation.cancel());
  }, []);

  return (
    <h1 ref={headingRef} className="m-0 text-[clamp(40px,6.1vw,88px)] leading-[1.18] font-semibold tracking-[-0.035em]">
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block first:text-balance">
          {line.split(" ").map((word, wordIndex) => {
            return (
              <span key={wordIndex} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span data-headline-word className="inline-block">{word}</span>
                {wordIndex < line.split(" ").length - 1 && " "}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
