"use client";

import { useEffect } from "react";

/** A4 폭(210mm)을 화면 픽셀로 옮긴 값 */
const A4_WIDTH = 794;
/** 좁은 화면에서 쪽 양옆에 남기는 여백 */
const GUTTER = 24;

/**
 * 휴대폰처럼 A4 폭보다 좁은 화면에서는 쪽을 통째로 줄여, 글자 배치가 PDF와 똑같이 보이게 합니다.
 * 인쇄할 때는 globals.css가 배율을 원래대로 돌립니다.
 */
export function PrintScale() {
  useEffect(() => {
    const doc = document.querySelector<HTMLElement>(".print-doc");
    if (!doc) return;
    const fit = () => {
      const scale = Math.min(1, (window.innerWidth - GUTTER) / A4_WIDTH);
      doc.style.zoom = scale < 1 ? String(scale) : "";
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return null;
}
