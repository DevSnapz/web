import React from 'react'

export default function Hero() {
  return (
    <section className="max-w-[1100px] mx-auto px-4 sm:px-8 grid md:grid-cols-2 gap-12 items-center py-20 border-b border-ink3">
      <div>
        <div className="inline-flex items-center gap-2 font-dmmono text-[0.7rem] text-g-text bg-g/10 border border-g-dim rounded-full px-3 py-1 mb-6"> 
          <span className="w-2 h-2 rounded-full bg-g animate-pulse" /> Open to contributors
        </div>
        <h1 className="font-outfit font-extrabold text-[clamp(2.8rem,5vw,4.2rem)] leading-[0.95] mb-6">
          Show.<br />
          <span className="text-transparent" style={{ WebkitTextStroke: '1px #1bce92' }}>Collaborate</span>.<br />
          <span className="text-gold">Grow.</span>
        </h1>
        <p className="text-ink1 max-w-[420px] mb-6">An interactive platform for developers to showcase active creations, recruit co-builders, seek code guidance, and collect milestone sponsorships.</p>
        <div className="flex gap-3 flex-wrap">
          <a className="font-dmmono text-sm border border-ink3 text-ink1 px-4 py-2 rounded-md" href="https://github.com/DevSnapz" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="font-dmmono text-sm border border-ink3 text-ink1 px-4 py-2 rounded-md" href="https://discord.gg/HKtj4rxZEF" target="_blank" rel="noopener noreferrer">Discord</a>
        </div>
      </div>

      <div className="hidden md:block bg-bg1 border border-ink3 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 bg-bg2 border-b border-ink3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <div className="ml-auto font-dmmono text-[0.7rem] text-ink1">devsnapz ~ terminal</div>
        </div>
        <div className="p-4 font-dmmono text-[0.78rem] leading-7">
          <div><span className="text-g">❯</span> <span className="text-ink0">whoami</span></div>
          <div className="text-ink1">→ <span className="text-g-text">DevSnapz</span> — project showcase hub</div>
          <div className="mt-2"><span className="text-g">❯</span> <span className="text-ink0">ls projects/</span></div>
          <div className="text-ink1">  <span className="text-g-text">aiverse/</span>    full-stack/    devtools/</div>
          <div className="mt-2"><span className="text-g">❯</span> <span className="text-ink0">cat mission.txt</span></div>
          <div className="text-ink1 italic">"Every idea is a node. DevSnapz connects them."</div>
          <div className="mt-2"><span className="text-g">❯</span> <span className="text-ink0">git status</span></div>
          <div className="text-ink1">On branch <span className="text-gold">main</span> · <span className="text-g-text">building</span> in progress</div>
        </div>
      </div>
    </section>
  )
}
