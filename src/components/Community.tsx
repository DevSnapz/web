import React from 'react'

const people = ['Student Innovators','Frontend Builders','AI & Backend Devs','Open-Source Mentors']

const iconForPerson = (person: string) => {
  switch (person) {
    case 'Student Innovators':
      return (
        <>
          <path d="M7 5l-4 7.5L7 20" />
          <path d="M17 5l4 7.5L17 20" />
        </>
      )
    case 'Frontend Builders':
      return (
        <>
          <path d="M7 20h4l9-9-4-4-9 9v4z" />
          <path d="M14 6l4 4" />
        </>
      )
    case 'AI & Backend Devs':
      return (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 6V3" />
          <path d="M12 21v-3" />
          <path d="M6 12H3" />
          <path d="M21 12h-3" />
          <path d="M8.5 8.5L6 6" />
          <path d="M15.5 8.5L18 6" />
          <path d="M8.5 15.5L6 18" />
          <path d="M15.5 15.5L18 18" />
        </>
      )
    case 'Open-Source Mentors':
      return (
        <>
          <path d="M6 3a3 3 0 1 0 0 6" />
          <path d="M6 15a3 3 0 1 0 0 6" />
          <path d="M18 9a3 3 0 1 0 0 6" />
          <path d="M6 6v6a6 6 0 0 0 12 0V9" />
        </>
      )
    default:
      return <circle cx="12" cy="12" r="10" />
  }
}

export default function Community(){
  return (
    <section id="community" className="max-w-[1280px] mx-auto px-4 sm:px-8 py-16">
      <div className="font-dmmono text-xs uppercase tracking-wider text-ink2 mb-6 anim">Student network</div>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <h2 className="font-outfit font-extrabold text-[clamp(1.8rem,3vw,2.6rem)] anim">Who collaborates<br/>here.</h2>
        <p className="text-ink1 text-sm anim text-left sm:text-right">Open to student creators across all campuses and disciplines. Whether you are pitching an idea, filling a skill gap, or mentoring peers, this is your hub.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 bg-bg3 rounded-xl overflow-hidden mt-8">
        {people.map(p => (
          <div key={p} className="bg-bg1 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-bg3 border border-ink3 flex items-center justify-center">
              <svg className="w-4 h-4 stroke-ink1" viewBox="0 0 24 24" fill="none">{iconForPerson(p)}</svg>
            </div>
            <div className="font-medium">{p}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-bg1 border border-ink3 rounded-xl p-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-outfit font-bold text-lg">Let's connect.</h3>
          <p className="text-ink1">Find us on any of these platforms.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a className="clink justify-center sm:justify-start" href="https://github.com/DevSnapz" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <a className="clink justify-center sm:justify-start" href="https://discord.gg/HKtj4rxZEF" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
            <span className="hidden sm:inline">Discord</span>
          </a>
          <a className="clink justify-center sm:justify-start" href="mailto:devsnapz@gmail.com">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span className="hidden sm:inline">Email</span>
          </a>
          <a className="clink justify-center sm:justify-start" href="https://devsnapz.frozenn.in/" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span className="hidden sm:inline">Website</span>
          </a>
        </div>
      </div>
    </section>
  )
}
