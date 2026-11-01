import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import {
  SearchIcon,
  PeopleIcon,
  ZapIcon,
  SparkleIcon,
  RepoIcon,
  CheckIcon,
} from '../components/Octicons';

export default function HomePage() {
  const features = [
    {
      icon: <SearchIcon className="w-5 h-5 fill-current text-[#79c0ff]" />,
      title: 'Discover Project Showcases',
      desc: 'Explore meaningful student-built projects across various domains and technical stacks.',
    },
    {
      icon: <PeopleIcon className="w-5 h-5 fill-current text-[#79c0ff]" />,
      title: 'Find Peer Collaborators',
      desc: 'Connect with developers who have complementary skills and a passion for building.',
    },
    {
      icon: <ZapIcon className="w-5 h-5 fill-current text-[#ff7b72]" />,
      title: 'Identify Skill Gaps',
      desc: 'Understand what technical competencies your project needs to ship to production.',
    },
    {
      icon: <SparkleIcon className="w-5 h-5 fill-current text-[#79c0ff]" />,
      title: 'Ship Real Software',
      desc: 'Learn, contribute, and build real-world software alongside other ambitious developers.',
    },
  ];

  const featuredProjects = [
    {
      id: 'campus-recycling',
      status: 'Open to join',
      title: 'campus-recycling-app',
      description: 'Build a smarter recycling telemetry experience for college campuses.',
      tags: ['react', 'postgresql', 'iot'],
      role: 'UI/UX Designer',
    },
    {
      id: 'studymate-ai',
      status: 'Open to join',
      title: 'studymate-ai',
      description: 'Personalized study planning and spaced repetition for students.',
      tags: ['python', 'pytorch', 'fastapi'],
      role: 'Frontend Developer',
    },
    {
      id: 'openfarm',
      status: 'Open to join',
      title: 'openfarm-telemetry',
      description: 'An open platform for smarter agricultural sensor analytics.',
      tags: ['typescript', 'node', 'timescaledb'],
      role: 'Backend Developer',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Create your profile',
      desc: 'List your technical competencies, learning targets, and current availability.',
    },
    {
      num: '02',
      title: 'Discover repositories and skill gaps',
      desc: 'Explore active student repos seeking collaborators or find peers whose skills bridge your gaps.',
    },
    {
      num: '03',
      title: 'Collaborate and ship together',
      desc: 'Submit pull requests, align on architecture, and build impactful software together.',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 bg-[#0d1117] text-[#f0f6fc]">
      
      {/* Hero Section */}
      <Hero />

      {/* SECTION A — WHAT YOU CAN DO (GitHub Primer Cards) */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="max-w-xl mb-6 space-y-1">
          <div className="text-xs font-mono uppercase text-[#58a6ff] font-semibold">
            Platform Capabilities
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f0f6fc]">
            What you can do on DevSnapz
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="bg-[#151b23] border border-[#3d444d] rounded-md p-4 flex flex-col justify-between shadow-xs hover:border-[#58a6ff]/50 transition-colors"
            >
              <div>
                <div className="text-xl mb-2">{feat.icon}</div>
                <h3 className="text-sm font-bold text-[#f0f6fc] mb-1">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#9198a1] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION B — FEATURED PROJECT SHOWCASES */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#3d444d] mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#f0f6fc]">
              Featured Project Showcases
            </h2>
            <p className="text-xs text-[#9198a1] mt-0.5">
              Explore student projects assembling engineering teams and bridging skill gaps.
            </p>
          </div>
          <Link
            to="/explore"
            className="text-xs font-semibold text-[#58a6ff] hover:underline"
          >
            View all projects →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredProjects.map((p) => (
            <div
              key={p.id}
              className="bg-[#151b23] border border-[#3d444d] rounded-md p-4 flex flex-col justify-between shadow-xs hover:border-[#58a6ff]/50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <RepoIcon className="w-4 h-4 fill-current text-[#9198a1] shrink-0" />
                    <Link
                      to="/explore"
                      className="font-bold text-sm text-[#58a6ff] hover:underline truncate"
                    >
                      {p.title}
                    </Link>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[rgba(248,81,73,0.15)] text-[#ff7b72] border border-[rgba(248,81,73,0.4)] flex items-center gap-1">
                    <ZapIcon className="w-3 h-3 fill-current text-[#ff7b72]" />
                    <span>Open</span>
                  </span>
                </div>

                <p className="text-xs text-[#9198a1] leading-relaxed min-h-[32px]">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-1 my-3">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono bg-[#21262d] border border-[#3d444d] text-[#f0f6fc] px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#3d444d] flex items-center justify-between text-xs">
                <span className="text-[#9198a1] text-[11px]">
                  Need: <strong className="text-[#f0f6fc]">{p.role}</strong>
                </span>
                <Link
                  to="/explore"
                  className="font-semibold text-xs text-[#58a6ff] hover:underline"
                >
                  View ➔
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION C — 3-STEP PROCESS */}
      <section id="how-it-works" className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="bg-[#151b23] border border-[#3d444d] rounded-md p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#f0f6fc]">
              How DevSnapz works
            </h2>
            <p className="text-xs text-[#9198a1] mt-0.5">
              From project showcase initialization to automated skill-gap matching and student team collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((st) => (
              <div key={st.num} className="space-y-1.5 p-3 rounded bg-[#010409] border border-[#3d444d]">
                <div className="font-mono font-bold text-xs text-[#58a6ff]">
                  Step {st.num}
                </div>
                <h3 className="font-bold text-sm text-[#f0f6fc]">
                  {st.title}
                </h3>
                <p className="text-xs text-[#9198a1] leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION D — INTELLIGENT MATCHING */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="border border-[#3d444d] rounded-md bg-[#151b23] p-6 sm:p-8 grid md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-6 space-y-3">
            <div className="text-xs font-mono uppercase text-[#58a6ff] font-semibold">
              Skill Alignment Matrix
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#f0f6fc]">
              Automated skill-gap matching across student projects.
            </h2>
            <p className="text-xs text-[#9198a1] leading-relaxed">
              DevSnapz inspects project requirements to flag missing engineering proficiencies and connects you directly with matching student collaborators.
            </p>
            <div className="pt-1">
              <Link
                to="/explore"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md text-xs shadow-xs"
              >
                <span>Browse Projects</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Visual Matching Representation */}
          <div className="md:col-span-6">
            <div className="bg-[#010409] border border-[#3d444d] rounded-md p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#3d444d]">
                <span className="font-bold text-[#f0f6fc]">Architectural Rationale</span>
                <span className="font-mono text-[10px] text-[#79c0ff] bg-[rgba(56,139,253,0.15)] px-2 py-0.2 rounded">
                  Explainable
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded bg-[#151b23] border border-[#3d444d]">
                  <div className="text-[10px] font-mono uppercase text-[#9198a1] mb-1">Repo Need</div>
                  <div className="font-bold text-[#ff7b72] flex items-center gap-1">
                    <ZapIcon className="w-3.5 h-3.5 fill-current text-[#ff7b72]" />
                    <span>PostgreSQL Lead</span>
                  </div>
                  <div className="text-[10px] text-[#9198a1]">campus-recycling-app</div>
                </div>

                <div className="p-2.5 rounded bg-[#151b23] border border-[#3d444d]">
                  <div className="text-[10px] font-mono uppercase text-[#9198a1] mb-1">Collaborator</div>
                  <div className="font-bold text-[#f0f6fc]">Alex M.</div>
                  <div className="text-[10px] text-[#79c0ff] flex items-center gap-1">
                    <CheckIcon className="w-3 h-3 fill-current text-[#79c0ff]" />
                    <span>Verified Competency</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#9198a1]">
                Alex's verified relational database experience complements the existing React frontend maintainer.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION E — OPEN SOURCE COMMUNITY */}
      <section id="community" className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="bg-[#151b23] border border-[#3d444d] rounded-md p-6 sm:p-8 text-center space-y-4">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#f0f6fc]">
              Built by developers. Open to everyone.
            </h2>
            <p className="text-xs text-[#9198a1] leading-relaxed">
              DevSnapz is a community-driven initiative licensed under MIT. Students from any institution can explore the codebase, report issues, and contribute directly.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://github.com/DevSnapz/web"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#3d444d] text-white rounded-md text-xs font-semibold shadow-xs flex items-center gap-2"
              >
                <span>Contribute on GitHub ↗</span>
              </a>

              <Link
                to="/explore"
                className="px-4 py-2 bg-[#1f6feb] hover:bg-[#2a7aef] text-white rounded-md text-xs font-semibold shadow-xs"
              >
                Explore Repositories
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
