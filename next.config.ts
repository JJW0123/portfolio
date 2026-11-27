import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

/** 같은 네트워크의 휴대폰 등에서 개발 서버로 접속할 때 이 PC의 내부 IP를 허용합니다. */
const lanAddresses = Object.values(networkInterfaces())
  .flat()
  .filter((net) => net?.family === "IPv4" && !net.internal)
  .map((net) => net!.address);

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  allowedDevOrigins: lanAddresses,
};

export default nextConfig;
