import { describe, expect, test } from "vitest";
import { PROJECTS } from "@/data/projects";
import type { Project } from "@/data/types";
import { findProject, fullMeta, getNeighbors, getVisibleProjects, padNumber, shortMeta } from "./project";

const makeProject = (overrides: Partial<Project>): Project => ({
  slug: "sample",
  title: "샘플",
  period: "2026.01 — 2026.02",
  team: "1인",
  summary: "",
  metrics: [],
  stack: [],
  steps: [],
  links: [],
  ...overrides,
});

describe("padNumber", () => {
  test("한 자리 수는 앞에 0을 붙인다", () => {
    expect(padNumber(1)).toBe("01");
    expect(padNumber(12)).toBe("12");
  });
});

describe("getVisibleProjects", () => {
  test("hidden 프로젝트를 제외한다", () => {
    const visible = getVisibleProjects();
    expect(visible.every((project) => !project.hidden)).toBe(true);
    expect(visible).toHaveLength(PROJECTS.filter((project) => !project.hidden).length);
  });

  test("slug가 서로 겹치지 않는다", () => {
    const slugs = PROJECTS.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("findProject", () => {
  test("보이는 프로젝트는 slug로 찾는다", () => {
    expect(findProject("forklift")?.title).toBe("무인 지게차 물류 자동화");
  });

  test("숨긴 프로젝트와 없는 slug는 undefined를 반환한다", () => {
    expect(findProject("sharehouse")).toBeUndefined();
    expect(findProject("no-such-project")).toBeUndefined();
  });
});

describe("meta 문자열", () => {
  test("shortMeta는 기간과 팀만 보여준다", () => {
    expect(shortMeta(makeProject({ role: "백엔드" }))).toBe("2026.01 — 2026.02 · 1인");
  });

  test("shortMeta는 기간의 일 단위를 떼고 연.월만 보여준다", () => {
    expect(shortMeta(makeProject({ period: "2026.04.25 — 2026.07.01" }))).toBe("2026.04 — 2026.07 · 1인");
  });

  test("fullMeta는 역할이 없으면 생략한다", () => {
    expect(fullMeta(makeProject({ role: "백엔드" }))).toBe("2026.01 — 2026.02 · 1인 · 백엔드");
    expect(fullMeta(makeProject({}))).toBe("2026.01 — 2026.02 · 1인");
  });
});

describe("getNeighbors", () => {
  const items = ["a", "b", "c"];

  test("가운데 항목은 앞뒤 항목을 반환한다", () => {
    expect(getNeighbors(items, 1)).toEqual({ prev: "a", next: "c" });
  });

  test("양 끝에서는 반대쪽 끝으로 순환한다", () => {
    expect(getNeighbors(items, 0)).toEqual({ prev: "c", next: "b" });
    expect(getNeighbors(items, 2)).toEqual({ prev: "b", next: "a" });
  });

  test("항목이 하나면 앞뒤 모두 자기 자신이다", () => {
    expect(getNeighbors(["only"], 0)).toEqual({ prev: "only", next: "only" });
  });
});

describe("데이터 연결", () => {
  test("보이는 프로젝트는 모두 목록용 한 줄 소개가 있고, 길이가 65자 이내다", () => {
    getVisibleProjects().forEach((project) => {
      expect(project.highlight, project.slug).toBeTruthy();
      expect(project.highlight?.length ?? 0, project.slug).toBeLessThanOrEqual(65);
    });
  });

  test("보이는 프로젝트의 화면 문구에는 작성 중 메모가 없다", () => {
    getVisibleProjects().forEach((project) => {
      const shownText = [
        project.title,
        project.badge,
        project.role,
        project.highlight,
        project.summary,
        project.metricNote,
        project.ps,
        project.note,
        ...project.metrics.flatMap((metric) => [metric.label, metric.value]),
        ...project.steps.flatMap((step) => [step.title, step.lead, step.strong, step.tail]),
      ].join(" ");
      expect(shownText, project.slug).not.toMatch(/예정|이 자리에 들어갑니다/);
    });
  });
});
