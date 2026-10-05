const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/";
const SIMPLE = "https://cdn.simpleicons.org/";

const devicon = (path: string) => `${DEVICON}${path}.svg`;

export const ICON = {
  java: devicon("java/java-original"),
  spring: devicon("spring/spring-original"),
  mysql: devicon("mysql/mysql-original"),
  redis: devicon("redis/redis-original"),
  swagger: devicon("swagger/swagger-original"),
  jwt: `${SIMPLE}jsonwebtokens/D63AFF`,
  docker: devicon("docker/docker-original"),
  nginx: devicon("nginx/nginx-original"),
  oracle: devicon("oracle/oracle-original"),
  aws: devicon("amazonwebservices/amazonwebservices-original-wordmark"),
  prometheus: devicon("prometheus/prometheus-original"),
  grafana: devicon("grafana/grafana-original"),
  firebase: devicon("firebase/firebase-plain"),
  python: devicon("python/python-original"),
  pytorch: devicon("pytorch/pytorch-original"),
  huggingface: `${SIMPLE}huggingface/FFD21E`,
  opencv: devicon("opencv/opencv-original"),
  mqtt: `${SIMPLE}mqtt/660066`,
  csharp: devicon("csharp/csharp-original"),
  unity: devicon("unity/unity-original"),
} as const;
