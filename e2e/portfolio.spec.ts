import { expect, test } from "@playwright/test";

test.describe("홈", () => {
  test("소개와 프로젝트 목록을 보여주고, 목록은 상세 페이지 링크다", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("전지웅");

    const rows = page.locator("#project ol a");
    await expect(rows).toHaveCount(3);
    await expect(rows.first()).toHaveAttribute("href", "/projects/stock-simulation/");
  });

  test("필수 섹션이 모두 있다", async ({ page }) => {
    await page.goto("/");
    for (const name of ["경력", "프로젝트", "기술", "교육 및 자격", "연락처"]) {
      await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
    }
  });

  test("경력 세부 내용은 펼친 채로 보인다", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("39개 테이블 규모의 ERD와 DB 정의서 설계")).toBeVisible();
  });

  test("프로젝트를 누르면 주소만 바뀌며 패널이 열리고, 뒤로 가기로 닫으면 메인 위치가 그대로다", async ({ page }) => {
    // 하이드레이션 전에 누르면 패널 대신 단독 페이지로 이동하므로, 스크립트가 다 붙을 때까지 기다립니다.
    await page.goto("/", { waitUntil: "networkidle" });
    await page.locator("#project").scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => window.scrollY);

    await page.locator("#project ol a").first().click();
    const panel = page.getByRole("dialog", { name: "가상 주식 시뮬레이션" });
    await expect(panel).toBeVisible();
    await expect(page).toHaveURL("/projects/stock-simulation/");

    // 패널 안 다음 프로젝트는 패널을 닫지 않고 내용만 바꿉니다.
    await panel.getByRole("link", { name: /다음 프로젝트/ }).click();
    await expect(page.getByRole("dialog", { name: "무인 지게차 물류 자동화" })).toBeVisible();
    await expect(page).toHaveURL("/projects/forklift/");

    await page.goBack();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page).toHaveURL("/");
    expect(await page.evaluate(() => window.scrollY)).toBe(before);
  });

  test("패널은 Esc로도 닫힌다", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const trigger = page.locator("#project ol a").nth(1);
    await trigger.focus();
    await page.keyboard.press("Enter");
    const panel = page.getByRole("dialog");
    const close = panel.getByRole("button", { name: "← 전체 프로젝트" });
    await expect(close).toBeFocused();
    await expect(page.locator("#home-content")).toHaveAttribute("inert", "");
    await page.keyboard.press("Shift+Tab");
    expect(await panel.evaluate((element) => element.contains(document.activeElement))).toBe(true);
    await expect(close).not.toBeFocused();
    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);
    await expect(page).toHaveURL("/");
    await expect(trigger).toBeFocused();
  });

  test("기본은 라이트이고, 테마 전환은 새로고침 후에도 유지된다", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);

    await page.getByRole("button", { name: "다크 모드로 전환" }).click();
    await expect(html).toHaveClass(/dark/);

    await page.reload();
    await expect(html).toHaveClass(/dark/);
  });
});

test("동작 줄이기를 켜면 첫 휠 입력으로 경력 섹션까지 점프하지 않는다", async ({ page, isMobile }) => {
  test.skip(isMobile, "휠 입력으로 확인하는 데스크톱 테스트입니다.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "다크 모드로 전환" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.mouse.move(300, 300);
  await page.mouse.wheel(0, 60);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  expect(await page.evaluate(() => scrollY)).toBeLessThan(120);
});

test.describe("스크립트 없이 보는 좁은 화면", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 320, height: 740 } });

  test("제목을 가리지 않고 가로로 넘치지 않는다", async ({ page }) => {
    await page.goto("/");
    const words = await page.locator("h1 [data-headline-word]").all();
    expect(words.length).toBeGreaterThan(0);
    for (const word of words) await expect(word).toHaveCSS("transform", "none");
    const { clientWidth, scrollWidth } = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});

test.describe("프로젝트 상세 페이지", () => {
  test("회고에서 Grafana 요청률 그래프를 원본 크기로 확대한다", async ({ page }) => {
    await page.goto("/projects/stock-simulation/");
    const trigger = page.locator("#retro").getByRole("button", { name: /이미지 확대:.*API 요청률/ });
    await trigger.click();
    const zoom = page.getByRole("dialog", { name: "이미지 확대 보기" });
    const image = zoom.getByRole("img", { name: /초당 API 요청 수/ });
    await expect(zoom).toBeVisible();
    const sizes = await image.evaluate(async (element: HTMLImageElement) => {
      await element.decode();
      return { natural: element.naturalWidth, displayed: element.getBoundingClientRect().width };
    });
    expect(sizes).toEqual({ natural: 801, displayed: 801 });
    await page.keyboard.press("Escape");
    await expect(zoom).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test("선택한 사진을 확대하고 닫으면 같은 사진으로 돌아간다", async ({ page }) => {
    await page.goto("/projects/stock-simulation/");
    const imageButton = page.getByRole("button", { name: /^이미지 확대: 종목 목록/ });
    await imageButton.click();
    const zoom = page.getByRole("dialog", { name: "이미지 확대 보기" });
    const enlarged = zoom.getByRole("img");
    await expect(zoom).toBeVisible();
    await expect(enlarged).toHaveAttribute("src", /\/1-market\.png$/);
    const displayedWidth = await enlarged.evaluate(async (image: HTMLImageElement) => {
      await image.decode();
      return image.getBoundingClientRect().width;
    });
    expect(displayedWidth).toBeGreaterThan(250);
    await zoom.getByRole("button", { name: "닫기" }).click();
    await expect(zoom).not.toBeVisible();
    await expect(imageButton).toBeFocused();
  });

  test("상세 패널에서 Esc는 이미지 확대부터 닫는다", async ({ page }) => {
    await page.goto("/");
    await page.locator("#project ol a").first().click();
    const panel = page.getByRole("dialog", { name: "가상 주식 시뮬레이션" });
    const imageButton = panel.getByRole("button", { name: /^이미지 확대: 종목 목록/ });
    await imageButton.click();
    const zoom = page.getByRole("dialog", { name: "이미지 확대 보기" });
    await expect(zoom).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(zoom).not.toBeVisible();
    await expect(panel).toBeVisible();
    await expect(imageButton).toBeFocused();
    await expect(page).toHaveURL("/projects/stock-simulation/");
  });

  test("제목을 보여주고 다음 프로젝트 링크로 이동한다", async ({ page }) => {
    await page.goto("/projects/forklift/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("무인 지게차 물류 자동화");
    await expect(page).toHaveTitle(/무인 지게차 물류 자동화/);

    await page.getByRole("link", { name: /다음 프로젝트/ }).click();
    await expect(page).toHaveURL("/projects/komit/");
  });

  test("내용이 없는 섹션은 숨긴다", async ({ page }) => {
    await page.goto("/projects/komit/");
    await expect(page.getByRole("heading", { level: 2, name: "개요" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "문제 해결" })).toHaveCount(0);
  });

  test("숨긴 프로젝트와 없는 주소는 404다", async ({ page }) => {
    for (const path of ["/projects/sharehouse/", "/projects/no-such-project/"]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(404);
    }
  });
});
