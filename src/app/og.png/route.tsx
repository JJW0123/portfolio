import { ImageResponse } from "next/og";
import { PROFILE } from "@/data/profile";
import { OG_IMAGE } from "@/lib/site";

export const dynamic = "force-static";

// opengraph-image 파일 규칙은 확장자 없는 파일을 만들어 웹 서버가 image/png로 내보내지 못하므로 .png 경로로 생성합니다.
// 기본 폰트에 한글 글리프가 없어 영문만 씁니다.
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "linear-gradient(135deg, #071726 0%, #0d2338 60%, #122c44 100%)",
          color: "#e6f1fa",
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 700, color: "#4fb1f0", letterSpacing: 2 }}>PORTFOLIO</div>
        <div style={{ marginTop: 24, fontSize: 88, fontWeight: 800, lineHeight: 1.1 }}>Backend Developer</div>
        <div style={{ marginTop: 32, fontSize: 36, color: "#a7c2d8" }}>
          {`github.com/${PROFILE.githubHandle.replace("@", "")}`}
        </div>
      </div>
    ),
    { width: OG_IMAGE.width, height: OG_IMAGE.height },
  );
}
