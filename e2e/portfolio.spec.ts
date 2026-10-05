import { expect, test } from "@playwright/test";

test.describe("홈", () => {
  test("히어로와 프로젝트 목록을 보여주고, 목록은 상세 페이지 링크다", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("전지웅");

    const rows = page.locator("#project ol a");
    await expect(rows).toHaveCount(4);
    await expect(rows.first()).toHaveAttribute("href", "/projects/forklift/");
  });

  test("프로젝트를 누르면 드로어가 열리고, ESC로 닫으면 포커스가 돌아온다", async ({ page }) => {
    await page.goto("/");
    const row = page.locator("#prj-forklift");
    await row.click();

    const drawer = page.getByRole("dialog", { name: "무인 지게차 물류 자동화" });
    await expect(drawer).toBeVisible();
    await expect(page.getByRole("button", { name: "닫기" })).toBeFocused();
    await expect(page).toHaveURL("/");

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(row).toBeFocused();
  });

  test("드로어의 다음 프로젝트 버튼으로 이동한다", async ({ page }) => {
    await page.goto("/");
    await page.locator("#prj-forklift").click();
    await page.getByRole("button", { name: /다음 프로젝트/ }).click();
    await expect(page.getByRole("dialog", { name: "가상 주식 시뮬레이션" })).toBeVisible();
    // 내용이 바뀌면 포커스도 맨 위(닫기 버튼)로 올라가야 합니다.
    await expect(page.getByRole("button", { name: "닫기" })).toBeFocused();
  });

  test("테마 전환은 새로고침 후에도 유지된다", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);

    await page.getByRole("button", { name: "라이트 모드로 전환" }).click();
    await expect(html).not.toHaveClass(/dark/);

    await page.reload();
    await expect(html).not.toHaveClass(/dark/);
  });
});

test.describe("프로젝트 상세 페이지", () => {
  test("제목을 보여주고 다음 프로젝트 링크로 이동한다", async ({ page }) => {
    await page.goto("/projects/forklift/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("무인 지게차 물류 자동화");
    await expect(page).toHaveTitle(/무인 지게차 물류 자동화/);

    await page.getByRole("link", { name: /다음 프로젝트/ }).click();
    await expect(page).toHaveURL("/projects/stock-simulation/");
  });

  test("숨긴 프로젝트와 없는 주소는 404다", async ({ page }) => {
    for (const path of ["/projects/sharehouse/", "/projects/no-such-project/"]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(404);
    }
  });
});
