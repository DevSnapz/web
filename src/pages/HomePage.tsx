import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';

export default function HomePage() {
  // Section A: What you can do cards
  const features = [
    {
      icon: '🔍',
      title: 'Discover Projects',
      desc: 'Explore meaningful student-built projects across various domains and technical stacks.',
    },
    {
      icon: '🤝',
      title: 'Find Collaborators',
      desc: 'Connect with people who have complementary skills and a passion for building.',
    },
    {
      icon: '⚡',
      title: 'Identify Skill Gaps',
      desc: 'Understand what technical expertise your project needs to move from idea to production.',
    },
    {
      icon: '🌱',
      title: 'Grow Together',
      desc: 'Learn, contribute, and build real-world software alongside other ambitious developers.',
    },
  ];

  // Section B: Featured Projects preview
  const featuredProjects = [
    {
      id: 'campus-recycling',
      icon: '♻️',
      status: 'Open to join',
      title: 'Campus Recycling App',
      description: 'Build a smarter recycling experience for college campuses.',
      tags: ['React', 'PostgreSQL'],
      role: 'UI/UX Designer',
    },
    {
      id: 'studymate-ai',
      icon: '🧠',
      status: 'Open to join',
      title: 'StudyMate AI',
      description: 'Personalized study planning for students.',
      tags: ['Python', 'Machine Learning'],
      role: 'Frontend Developer',
    },
    {
      id: 'openfarm',
      icon: '🌱',
      status: 'Open to join',
      title: 'OpenFarm',
      description: 'An open platform for smarter agricultural insights.',
      tags: ['JavaScript', 'Data'],
      role: 'Backend Developer',
    },
  ];

  // Section C: How DevSnapz Works
  const steps = [
    {
      num: '01',
      title: 'Create your profile',
      desc: 'List your technical competencies, interests, and current availability for projects.',
    },
    {
      num: '02',
      title: 'Discover projects and teammates',
      desc: 'Explore active builds seeking collaborators or find teammates whose skills bridge your gaps.',
    },
    {
      num: '03',
      title: 'Collaborate and start building',
      desc: 'Connect directly, align on project goals, and ship impactful software together.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Hero Section */}
      <Hero />

      {/* SECTION A — WHAT YOU CAN DO */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-[#635BFF] dark:text-[#58a6ff] font-semibold">
            Platform Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] dark:text-[#f0f6fc]">
            What you can do on DevSnapz
          </h2>
          <p className="text-sm text-[#6B7280] dark:text-[#9198a1]">
            Everything you need to turn student innovation ideas into active collaborative builds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#635BFF]/30 dark:hover:border-[#1f6feb] transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#F3F1FF] text-[#635BFF] dark:bg-[rgba(56,139,253,0.15)] dark:text-[#58a6ff] flex items-center justify-center text-xl mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-[#111827] dark:text-[#f0f6fc] mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-[#9198a1] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION B — FEATURED PROJECTS */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#E5E7EB] dark:border-[#3d444d]">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#635BFF] dark:text-[#58a6ff] font-semibold mb-1">
              Active Builds
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] dark:text-[#f0f6fc]">
              Featured projects
            </h2>
            <p className="text-sm text-[#6B7280] dark:text-[#9198a1] mt-1">
              Explore teams currently assembling talent and contributors.
            </p>
          </div>
          <Link
            to="/explore"
            className="text-xs font-semibold text-[#635BFF] hover:text-[#5246C9] dark:text-[#58a6ff] dark:hover:text-[#79c0ff] flex items-center gap-1 font-sans self-start sm:self-auto"
          >
            <span>View all projects</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#635BFF]/40 dark:hover:border-[#1f6feb] transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F3F1FF] dark:bg-[rgba(56,139,253,0.15)] flex items-center justify-center text-lg">
                    {p.icon}
                  </div>
                  {/* Tritanopia Coral status */}
                  <span className="text-xs font-medium text-[#17936C] bg-[#ECFDF5] border border-[#17936C]/20 dark:text-[#ff7b72] dark:bg-[rgba(248,81,73,0.15)] dark:border-[rgba(248,81,73,0.4)] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#17936C] dark:bg-[#ff7b72]" />
                    <span>{p.status}</span>
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#111827] dark:text-[#f0f6fc] mb-1">
                  {p.title}
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-[#9198a1] leading-relaxed min-h-[36px]">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-1.5 my-4">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.7rem] font-mono bg-[#F3F1FF] text-[#635BFF] border border-[#635BFF]/20 dark:bg-[rgba(56,139,253,0.15)] dark:text-[#79c0ff] dark:border-[rgba(56,139,253,0.3)] px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3.5 border-t border-[#E5E7EB] dark:border-[#3d444d] flex items-center justify-between text-xs">
                <span className="text-[#111827] dark:text-[#f0f6fc] font-medium">
                  Looking for: <span className="text-[#6B7280] dark:text-[#9198a1]">{p.role}</span>
                </span>
                <Link
                  to="/explore"
                  className="font-semibold text-[#635BFF] hover:text-[#5246C9] dark:text-[#58a6ff] dark:hover:text-[#79c0ff] flex items-center gap-0.5"
                >
                  View project ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION C — HOW DEVSNAPZ WORKS */}
      <section id="how-it-works" className="max-w-[1280px] mx-auto px-4 sm:px-8 py-6">
        <div className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-[#635BFF] dark:text-[#58a6ff] font-semibold">
              Simple 3-Step Process
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] dark:text-[#f0f6fc]">
              How DevSnapz works
            </h2>
            <p className="text-sm text-[#6B7280] dark:text-[#9198a1]">
              From your initial idea to finding the right co-builders and shipping together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((st) => (
              <div key={st.num} className="flex flex-col space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#F3F1FF] text-[#635BFF] dark:bg-[rgba(56,139,253,0.15)] dark:text-[#58a6ff] font-mono font-bold text-sm flex items-center justify-center">
                  {st.num}
                </div>
                <h3 className="font-bold text-base text-[#111827] dark:text-[#f0f6fc]">
                  {st.title}
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-[#9198a1] leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION D — INTELLIGENT MATCHING */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#F3F1FF]/60 dark:bg-[#151b23] border border-[#635BFF]/20 dark:border-[#3d444d] rounded-3xl p-8 sm:p-12">
          
          <div className="md:col-span-6 space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-[#635BFF] dark:text-[#58a6ff] font-semibold">
              Skill Alignment
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#f0f6fc] leading-tight">
              Find the right people for your next big idea.
            </h2>
            <p className="text-sm text-[#4B5563] dark:text-[#c9d1d9] leading-relaxed">
              DevSnapz helps identify project skill gaps and recommends collaborators whose skills match what your team needs.
            </p>
            <div className="pt-2">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#635BFF] hover:bg-[#5246C9] dark:bg-[#1f6feb] dark:hover:bg-[#2a7aef] text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
              >
                <span>Browse Matching Roles</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Visual Matching Representation */}
          <div className="md:col-span-6">
            <div className="bg-white dark:bg-[#0d1117] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-[#3d444d]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#17936C] dark:bg-[#79c0ff]" />
                  <span className="text-xs font-mono font-semibold text-[#111827] dark:text-[#f0f6fc]">Skill Gap Alignment</span>
                </div>
                <span className="text-[0.68rem] font-mono text-[#635BFF] dark:text-[#58a6ff] bg-[#F3F1FF] dark:bg-[rgba(56,139,253,0.15)] px-2.5 py-0.5 rounded-full font-medium">
                  Explainable
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Project Needs: Tritanopia Coral */}
                <div className="p-3 rounded-xl bg-[#F7F8FC] dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d]">
                  <div className="text-[0.65rem] font-mono uppercase text-[#9CA3AF] dark:text-[#656c76] mb-1 font-semibold">Project Needs</div>
                  <div className="font-bold text-[#111827] dark:text-[#ff7b72] flex items-center gap-1">
                    <span>⚡</span>
                    <span>PostgreSQL Architect</span>
                  </div>
                  <div className="text-[0.68rem] text-[#6B7280] dark:text-[#9198a1] mt-0.5">Campus Recycling App</div>
                </div>

                {/* Collaborator: Tritanopia Cyan */}
                <div className="p-3 rounded-xl bg-[#F7F8FC] dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d]">
                  <div className="text-[0.65rem] font-mono uppercase text-[#9CA3AF] dark:text-[#656c76] mb-1 font-semibold">Collaborator</div>
                  <div className="font-bold text-[#111827] dark:text-[#f0f6fc]">Alex M.</div>
                  <div className="text-[0.68rem] text-[#17936C] dark:text-[#79c0ff] mt-0.5 flex items-center gap-1 font-medium">
                    <span>✓</span>
                    <span>Verified PostgreSQL Skill</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F3F1FF] dark:bg-[rgba(56,139,253,0.12)] border border-[#635BFF]/25 dark:border-[rgba(56,139,253,0.35)] text-xs">
                <span className="font-semibold text-[#635BFF] dark:text-[#58a6ff]">✨ Transparent Rationale: </span>
                <span className="text-[#4B5563] dark:text-[#c9d1d9]">The collaborator's verified relational database experience complements the project's frontend team without opaque guesswork.</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION E — OPEN SOURCE COMMUNITY */}
      <section id="community" className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-3xl p-8 sm:p-12 text-center shadow-sm">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-[#635BFF] dark:text-[#58a6ff] font-semibold">
              Open Collaboration
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#f0f6fc]">
              Built by developers. Open to everyone.
            </h2>
            <p className="text-sm text-[#6B7280] dark:text-[#9198a1] leading-relaxed">
              DevSnapz is a community-driven initiative licensed under MIT. Students from any institution can explore the codebase, report bugs, propose features, and contribute directly.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://github.com/DevSnapz/web"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#111827] hover:bg-black dark:bg-[#21262d] dark:hover:bg-[#30363d] dark:border dark:border-[#3d444d] text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>Contribute on GitHub ↗</span>
              </a>

              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E5E7EB] hover:bg-[#F7F8FC] dark:bg-[#151b23] dark:border-[#3d444d] dark:hover:bg-[#1c2128] text-[#111827] dark:text-[#f0f6fc] rounded-xl text-xs font-semibold shadow-xs transition-all"
              >
                <span>Explore Student Projects</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
