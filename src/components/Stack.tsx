import React from 'react'

const rows = [
  { cat: 'Frontend', tags: ['React','Next.js','Tailwind CSS','Vue','HTML/CSS'] },
  { cat: 'Backend & APIs', tags: ['Node.js','Express','FastAPI','REST','GraphQL'] },
  { cat: 'Languages', tags: ['TypeScript','Python','JavaScript','C++','Rust'] },
  { cat: 'Data & Search', tags: ['PostgreSQL','pgvector','Supabase','MongoDB','Redis'] },
  { cat: 'AI & Cloud', tags: ['Groq','LLMs','Docker','GitHub Actions','Vercel'] }
]

export default function Stack() {
  return (
    <section id="stack" className="max-w-[1280px] mx-auto px-4 sm:px-8 py-16">
      <div className="font-mono text-xs uppercase tracking-wider text-ink2 mb-6 anim">Innovation stack</div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="anim">
          <h2 className="font-outfit font-extrabold text-[clamp(1.8rem,3vw,2.6rem)] mb-4 leading-tight text-ink0">Technologies<br/>students ship.</h2>
          <p className="text-ink1 text-sm leading-relaxed">From hackathon prototypes to production platforms. DevSnapz supports projects built with the modern student developer stack.</p>
        </div>

        <div className="md:col-span-2 flex flex-col gap-3">
          {rows.map(r => (
            <div key={r.cat} className="bg-bg1 border border-ink3 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 transition-all hover:border-ink3/80">
              <div className="font-mono text-xs uppercase text-ink2 min-w-[100px] font-semibold">{r.cat}</div>
              <div className="flex flex-wrap gap-2">
                {r.tags.map(t => (
                  <div key={t} className={`text-xs font-dmmono ${['React','Node.js','TypeScript','MongoDB','Docker','Tailwind'].includes(t) ? 'bg-g/10 text-g-text border border-g-dim rounded-sm px-2 py-1' : 'bg-bg2 text-ink1 border border-ink3 rounded-sm px-2 py-1'}`}>{t}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
