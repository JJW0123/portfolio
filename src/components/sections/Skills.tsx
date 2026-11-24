"use client";

import { motion, useReducedMotion } from "motion/react";
import { Section } from "@/components/layout/Section";
import { MAIN_SKILLS, OTHER_SKILLS } from "@/data/profile";
import type { SkillLevel } from "@/data/types";

const LEVEL_TEXT: Record<SkillLevel, string> = { 1: "하", 2: "중하", 3: "중", 4: "중상", 5: "상" };

function LevelBar({ level }: { level: SkillLevel }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex items-center gap-3">
      {/* 화면 진입은 크기가 변하지 않는 막대 전체로 감지합니다. 칸은 scaleX 0에서 시작해 크기가 없어 따로 감지할 수 없습니다. */}
      <motion.span
        className="flex gap-1"
        role="img"
        aria-label={`숙련도 5단계 중 ${level}단계`}
        initial={reduce ? false : "hidden"}
        whileInView="shown"
        viewport={{ once: true, amount: 0.5 }}
      >
        {[1, 2, 3, 4, 5].map((step) => (
          <span key={step} className="relative h-2 w-6 overflow-hidden bg-line">
            {step <= level && (
              <motion.span
                className="absolute inset-0 origin-left bg-accent"
                variants={{
                  hidden: { scaleX: 0 },
                  shown: { scaleX: 1, transition: { duration: 0.35, delay: (step - 1) * 0.06, ease: "easeOut" } },
                }}
              />
            )}
          </span>
        ))}
      </motion.span>
      <span className="text-sm text-muted">{LEVEL_TEXT[level]}</span>
    </div>
  );
}

export function Skills() {
  const reduce = useReducedMotion();
  return (
    <Section id="skills" num="03" title="기술">
      <h3 className="m-0 text-sm font-normal text-muted">주력 기술</h3>
      <ul className="m-0 mt-4 mb-16 list-none p-0">
        {MAIN_SKILLS.map((skill) => (
          <li
            key={skill.name}
            className="grid gap-3 border-b border-line py-[22px] md:grid-cols-[260px_minmax(0,1fr)] md:items-center md:gap-10"
          >
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 쓰지 않습니다. */}
              <img src={skill.icon} alt="" width={40} height={40} loading="lazy" className="size-10 shrink-0 object-contain" />
              <div className="flex flex-col gap-2">
                <span className="text-[22px] font-semibold">{skill.name}</span>
                <LevelBar level={skill.level} />
              </div>
            </div>
            <p className="m-0 text-[15px] leading-[1.6] text-body">{skill.note}</p>
          </li>
        ))}
      </ul>

      <h3 className="m-0 text-sm font-normal text-muted">그 외 사용해 본 기술</h3>
      <motion.ul
        className="m-0 mt-4 list-none p-0"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {OTHER_SKILLS.map((group) => (
          <li key={group.label} className="grid gap-1 border-b border-line py-3.5 md:grid-cols-[260px_minmax(0,1fr)] md:gap-10">
            <span className="text-sm text-muted">{group.label}</span>
            <span className="text-base">{group.items.join(", ")}</span>
          </li>
        ))}
      </motion.ul>
    </Section>
  );
}
