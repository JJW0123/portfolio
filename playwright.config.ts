import { defineConfig, devices } from "@playwright/test";

// 브라우저를 따로 내려받지 않도록 설치된 Chrome(channel: "chrome")을 씁니다.
export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:3000" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: { command: "npm run dev", url: "http://localhost:3000", reuseExistingServer: true },
});
