import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Capabilities from '../components/Capabilities';
import Stack from '../components/Stack';
import Ecosystem from '../components/Ecosystem';
import Community from '../components/Community';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const workflowSteps = [
    {
      num: '01',
      title: 'Outline Project & Known Skills',
      desc: 'Post your prototype, hackathon build, or project idea alongside the technologies your team already knows.',
      badge: 'Step 1: Publication',
    },
    {
      num: '02',
      title: 'AI Detects Missing Gaps',
      desc: 'Automated requirement analysis compares project architecture needs against your stack to flag missing competencies.',
      badge: 'Step 2: Gap Analysis',
    },
    {
      num: '03',
      title: 'Connect, Learn & Ship',
      desc: 'Review explainable teammate recommendations, send structured collaboration requests, and access learning guides.',
      badge: 'Step 3: Peer Matching',
    },
  ];

  const faqs = [
    {
      q: 'Do I need a complete project to publish on DevSnapz?',
      a: 'No! You can publish early prototypes, hackathon concepts, or active builds. In fact, posting early allows you to identify missing technical skills and recruit co-builders from day one.',
    },
    {
      q: 'How does the AI skill-gap matching work?',
      a: 'DevSnapz analyzes your project description to identify required technical competencies, compares them against your team’s known skills, and flags the gaps. It then surfaces student developers whose verified competencies match those missing roles with transparent, explainable rationales.',
    },
    {
      q: 'Can beginners or first-time open-source contributors participate?',
      a: 'Absolutely. Every project can define claimable beginner-friendly issues with difficulty tags (Easy, Medium, Hard) and host technical mentorship Q&A discussions.',
    },
    {
      q: 'Is DevSnapz open source?',
      a: 'Yes, DevSnapz is 100% open source under the permissive MIT license. Anyone in the student community can inspect the code, suggest improvements, and contribute.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Platform Capabilities */}
      <Capabilities />

      {/* 3. Three-Step Workflow Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 py-16 border-t border-ink3">
        <div className="font-mono text-xs uppercase tracking-wider text-ink2 mb-4">How it works</div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-outfit font-extrabold text-[clamp(1.8rem,3vw,2.5rem)] leading-tight text-ink0">
              Three steps from idea<br />to active build.
            </h2>
          </div>
          <p className="text-ink1 text-sm max-w-[460px]">
            A transparent, frictionless workflow designed to replace scattered chat requests with structured student matchmaking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workflowSteps.map((step) => (
            <div
              key={step.num}
              className="bg-bg1 border border-ink3 rounded-2xl p-6 relative flex flex-col justify-between hover:border-g-dim transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-outfit font-extrabold text-3xl text-ink3">{step.num}</span>
                  <span className="font-mono text-[0.65rem] text-g-text bg-g/10 border border-g-dim px-2.5 py-0.5 rounded-full font-medium">
                    {step.badge}
                  </span>
                </div>
                <h3 className="font-outfit font-bold text-lg text-ink0 mb-2">{step.title}</h3>
                <p className="text-ink1 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Project Showcase Archetype */}
      <Ecosystem />

      {/* 5. Innovation Stack */}
      <Stack />

      {/* 6. Manifesto Banner */}
      <section className="manifesto border-t border-ink3">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-16 text-center">
          <h2 className="manifesto-hl mx-auto">
            "Every idea is a node. <span className="text-g">DevSnapz</span> connects them into something <em className="text-gold">real</em>."
          </h2>
          <p className="manifesto-body mx-auto mt-4 text-sm sm:text-base">
            An open student innovation ecosystem built to eliminate networking friction and connect project ideas directly with peer collaborators and technical guidance.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/explore"
              className="bg-g text-white font-semibold px-6 py-3 rounded-lg hover:bg-g-dim shadow-sm hover:shadow-[0_0_20px_rgba(99,91,255,0.25)] active:scale-95 transition-all text-xs font-sans inline-flex items-center gap-2"
            >
              Enter Showcase Gallery ➔
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Frequently Asked Questions (FAQ) Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 py-16 border-t border-ink3">
        <div className="font-mono text-xs uppercase tracking-wider text-ink2 mb-4">Frequently asked questions</div>
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <h2 className="font-outfit font-extrabold text-2xl text-ink0 mb-3">
              Everything you need<br />to know.
            </h2>
            <p className="text-xs text-ink1 leading-relaxed">
              Have other questions? Join our open student Discord or check out the project repository on GitHub.
            </p>
          </div>

          <div className="md:col-span-8 space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.q}
                className="bg-bg1 border border-ink3 rounded-xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-sm font-outfit font-bold text-ink0 hover:text-g transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-ink2 font-mono text-base">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-ink1 leading-relaxed border-t border-ink3/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Student Network / Community */}
      <Community />
    </>
  );
}
