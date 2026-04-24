type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">{eyebrow}</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-slate-600 md:text-base">{description}</p>
    </section>
  );
}
