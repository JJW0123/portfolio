// 포트폴리오를 A4 PDF로 저장합니다. 개발 서버(npm run dev)를 띄운 상태에서 `npm run pdf`로 실행합니다.
// 사이트에서 여는 public/<이름>_포트폴리오.pdf를 덮어씁니다. 파일 이름은 src/lib/site.ts의 PORTFOLIO_PDF와 같아야 합니다.
// 다른 주소에서 뽑으려면 PDF_URL을, 저장 위치를 바꾸려면 PDF_OUT을 지정합니다.
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { chromium } from "@playwright/test";

const url = process.env.PDF_URL ?? "http://localhost:3000/print/";

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const response = await page.goto(url, { waitUntil: "networkidle" });
  if (!response?.ok()) throw new Error(`${url} 응답 코드 ${response?.status()}`);

  // 개발 서버의 Next.js 표시 단추가 PDF에 찍히지 않게 숨기고, 글꼴과 이미지가 다 받아질 때까지 기다립니다.
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode().catch(() => undefined)));
  });

  const title = await page.title();
  // 문서 제목("전지웅 포트폴리오")의 공백을 밑줄로 바꾼 이름입니다.
  const out = resolve(process.env.PDF_OUT ?? `public/${title.replace(/\s+/g, "_")}.pdf`);
  await mkdir(dirname(out), { recursive: true });

  await page.pdf({
    path: out,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: `<div style="width:100%;padding:0 17mm;font-size:8px;color:#9a9a9a;display:flex;justify-content:space-between;font-family:sans-serif">
      <span>${title}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
    </div>`,
  });
  console.log(`저장했습니다: ${out}`);
} finally {
  await browser.close();
}
