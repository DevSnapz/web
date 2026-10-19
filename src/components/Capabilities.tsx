import React from 'react'

const items = [
  { num: '01', name: 'Project Showcase', desc: 'Publish active student builds, prototypes, and hackathon ideas with clear goals and open roles.' },
  { num: '02', name: 'Skill-Gap Analysis', desc: 'Automatically analyze project requirements and highlight missing competencies needed to complete the build.' },
  { num: '03', name: 'Peer Matchmaking', desc: 'Connect with student collaborators based on verified technical skills, campus affinity, and availability.' },
  { num: '04', name: 'Explainable Guidance', desc: 'Receive transparent rationales for teammate suggestions alongside targeted learning resources to level up.' }
]

export default function Capabilities() {
  return (
    <section id="capabilities" className="max-w-[1280px] mx-auto px-4 sm:px-8 py-16">
      <div className="font-dmmono text-xs uppercase tracking-wider text-ink2 mb-6 anim">Platform capabilities</div>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <h2 className="font-outfit font-extrabold text-[clamp(1.8rem,3vw,2.6rem)] leading-tight anim">How students<br/>build here.</h2>
        <p className="text-ink1 max-w-[520px] text-sm anim text-left sm:text-right">Four core pillars bridging student ideas, missing skills, and peer collaborator matching.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-bg3 rounded-xl overflow-hidden mt-8">
        {items.map((it) => (
          <div key={it.num} className="bg-bg1 p-6">
            <div className="text-[2.5rem] font-outfit font-extrabold text-ink3 mb-3">{it.num}</div>
            <div className="w-10 h-10 rounded-md bg-g/10 border border-g-dim flex items-center justify-center mb-3">
              <svg className="w-4 h-4 stroke-g" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="2.5" /></svg>
            </div>
            <div className="font-outfit font-semibold">{it.name}</div>
            <div className="text-sm text-ink1 mt-2">{it.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
