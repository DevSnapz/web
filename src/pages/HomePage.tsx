import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Capabilities from '../components/Capabilities';
import Stack from '../components/Stack';
import Ecosystem from '../components/Ecosystem';
import Community from '../components/Community';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <Stack />
      <Ecosystem />
      
      <section className="manifesto">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-16 text-center border-t border-ink3">
          <h2 className="manifesto-hl mx-auto">
            "Every idea is a node. <span className="text-g">DevSnapz</span> connects them into something <em className="text-gold">real</em>."
          </h2>
          <p className="manifesto-body mx-auto mt-4">
            An open student innovation ecosystem built to eliminate networking friction and connect project ideas directly with peer collaborators and technical guidance.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/explore"
              className="bg-g text-bg0 font-semibold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(27,206,146,0.3)] active:scale-95 transition-all text-xs font-dmmono inline-flex items-center gap-2"
            >
              Enter Showcase Gallery ➔
            </Link>
          </div>
        </div>
      </section>

      <Community />
    </>
  );
}
