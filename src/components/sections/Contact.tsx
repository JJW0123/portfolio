import { PROFILE } from "@/data/profile";

export function Contact() {
  return (
    <section aria-labelledby="contact-heading" className="w-full pt-22 pb-26">
      <div data-su>
        <h2 id="contact-heading" className="m-0 mb-7 text-center text-[30px] leading-[1.45] font-bold text-ink">
          감사합니다
          <br />
          더 궁금한 점이 있다면
          <br />
          편하게 연락주세요
        </h2>
        <dl className="mx-auto my-0 grid w-[340px] max-w-full grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-3.5 rounded-lg border border-line bg-surface px-7 py-6 text-[15px]">
          <dt className="font-bold text-ink">이메일</dt>
          <dd className="m-0 [overflow-wrap:anywhere]">
            <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          </dd>
          <dt className="font-bold text-ink">GitHub</dt>
          <dd className="m-0">
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
              {PROFILE.githubHandle}
            </a>
          </dd>
        </dl>
      </div>
    </section>
  );
}
