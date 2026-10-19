import React from 'react'

export default function Ecosystem(){
  return (
    <section id="ecosystem" className="max-w-[1100px] mx-auto px-4 sm:px-8 py-12">
      <div className="font-dmmono text-xs uppercase tracking-wider text-ink2 mb-6 anim">Featured showcase</div>
      <div className="grid md:grid-cols-2 gap-6 bg-bg1 border border-ink3 rounded-xl overflow-hidden">
        <div className="p-6 md:border-r md:border-ink3">
          <div className="inline-flex items-center gap-2 font-dmmono text-xs text-g-text bg-g/10 border border-g-dim rounded-full px-3 py-1 mb-4">
            <span className="w-2 h-2 rounded-full bg-g" /> Active Showcase · Matching Enabled
          </div>
          <div className="text-2xl font-outfit font-extrabold mb-2">Campus EcoSync</div>
          <p className="text-ink1 mb-4">A student-led initiative to optimize campus resource recovery with smart logistics. The founding team knows React and needs database architecture and UI/UX design support to ship.</p>
          <div className="flex gap-3">
            <a className="font-dmmono text-sm bg-g text-bg0 px-4 py-2 rounded-md" href="#showcase-feed">Explore Project ➔</a>
            <a className="font-dmmono text-sm border border-ink3 px-4 py-2 rounded-md" href="https://github.com/DevSnapz" target="_blank" rel="noopener noreferrer">View Open Roles (2)</a>
          </div>
        </div>
        <div className="p-6 bg-bg2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-ink2 uppercase">Status</div>
              <div className="text-lg font-outfit font-bold text-g">Seeking Collaborators ●</div>
            </div>
            <div>
              <div className="text-xs text-ink2 uppercase">Focus</div>
              <div className="font-dmmono text-ink1">Campus Automation</div>
            </div>
            <div>
              <div className="text-xs text-ink2 uppercase">Skill Gaps</div>
              <div className="text-lg">PostgreSQL · UI/UX</div>
            </div>
            <div>
              <div className="text-xs text-ink2 uppercase">Team Stack</div>
              <div className="font-dmmono text-g-text">React · Tailwind · Node.js</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
