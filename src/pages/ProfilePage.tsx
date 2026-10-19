import React from 'react';
import { Link } from 'react-router-dom';
import { Project, CollaboratorApplication } from '../types';

interface ProfilePageProps {
  projects: Project[];
  applications: CollaboratorApplication[];
  onOpenCreateWizard: () => void;
}

export default function ProfilePage({ projects, applications, onOpenCreateWizard }: ProfilePageProps) {
  // Mock current student profile (will connect to Supabase Auth in Phase 4)
  const student = {
    name: 'Frozen',
    avatar: 'https://avatars.githubusercontent.com/u/174297688?s=96&v=4',
    handle: '@frozen-dev',
    institution: 'Student Innovation Network',
    department: 'Computer Science & Engineering',
    year: 'Class of 2026',
    bio: 'Full-stack builder passionate about autonomous agents, developer utilities, and high-performance reactive web systems. Seeking collaborators for campus-scale innovation builds.',
    github: 'https://github.com/Frozen-47',
    discord: 'frozen#0001',
    availability: 'Available for Hackathons & Projects',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python', 'Vector DB', 'PostgreSQL'],
    learningInterests: ['Distributed LLM Pipelines', 'pgvector Clustering', 'WebAssembly'],
  };

  const userProjects = projects.filter((p) => p.creatorName === student.name || p.creatorGithub === 'Frozen-47');
  const userApplications = applications.filter((a) => a.applicantName.toLowerCase().includes('frozen') || a.applicantName.toLowerCase().includes('david'));

  return (
    <section id="student-profile" className="max-w-[1100px] mx-auto px-4 sm:px-8 py-12 relative z-10">
      
      {/* Profile Header Card */}
      <div className="bg-bg1 border border-ink3 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-ink3">
          <div className="flex items-center gap-5">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-g/40 object-cover shadow-[0_0_20px_rgba(27,206,146,0.15)]"
            />
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-outfit font-extrabold text-2xl sm:text-3xl text-ink0">{student.name}</h1>
                <span className="inline-flex items-center gap-1.5 font-dmmono text-xs text-g-text bg-g/10 border border-g-dim rounded-full px-3 py-1">
                  <span className="w-2 h-2 rounded-full bg-g animate-pulse" /> {student.availability}
                </span>
              </div>
              <div className="font-dmmono text-xs text-ink2 mt-1">{student.handle} · {student.institution}</div>
              <div className="text-xs text-ink1 mt-0.5">{student.department} · {student.year}</div>
            </div>
          </div>

          <div className="flex gap-2.5 flex-wrap">
            <a
              href={student.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-dmmono text-xs border border-ink3 text-ink1 hover:text-ink0 hover:bg-bg2 px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
            <button
              onClick={onOpenCreateWizard}
              className="bg-g text-bg0 font-semibold px-4 py-2 rounded-lg text-xs font-dmmono hover:shadow-[0_0_15px_rgba(27,206,146,0.3)] transition-all active:scale-95"
            >
              + Create Project
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className="py-5">
          <h3 className="font-dmmono text-xs uppercase text-ink2 tracking-wider mb-2">About Developer</h3>
          <p className="text-sm text-ink1 leading-relaxed max-w-3xl">{student.bio}</p>
        </div>

        {/* Skills & Learning Interests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-ink3">
          <div>
            <h3 className="font-dmmono text-xs uppercase text-ink2 tracking-wider mb-3">Known Competencies & Stack</h3>
            <div className="flex flex-wrap gap-2">
              {student.skills.map((skill) => (
                <span
                  key={skill}
                  className="font-dmmono text-xs bg-g/10 text-g-text border border-g-dim px-3 py-1 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-dmmono text-xs uppercase text-ink2 tracking-wider mb-3">Currently Exploring / Skill Targets</h3>
            <div className="flex flex-wrap gap-2">
              {student.learningInterests.map((interest) => (
                <span
                  key={interest}
                  className="font-dmmono text-xs bg-bg2 text-ink1 border border-ink3 px-3 py-1 rounded-md"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Projects & Collaborations Tabs/Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: My Published Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-outfit font-extrabold text-xl text-ink0">My Published Projects</h2>
            <span className="font-dmmono text-xs text-ink2">{userProjects.length} Active</span>
          </div>

          {userProjects.length === 0 ? (
            <div className="bg-bg1 border border-ink3 rounded-xl p-8 text-center text-sm text-ink2">
              No projects published yet. Click "Create Project" to showcase your work!
            </div>
          ) : (
            <div className="space-y-4">
              {userProjects.map((p) => (
                <div key={p.id} className="bg-bg1 border border-ink3 rounded-xl p-5 hover:border-g/40 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link to={`/projects/${p.id}`} className="font-outfit font-bold text-lg text-ink0 hover:text-g transition-colors">
                        {p.title}
                      </Link>
                      <p className="text-xs text-ink1 mt-1 leading-relaxed">{p.pitch}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.techStack.map((tech) => (
                          <span key={tech} className="text-[0.7rem] font-dmmono bg-bg2 text-ink2 px-2 py-0.5 rounded border border-ink3">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      to={`/projects/${p.id}`}
                      className="text-xs font-dmmono text-g hover:underline whitespace-nowrap pt-1"
                    >
                      View Hub ➔
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Outgoing Collaborations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-outfit font-extrabold text-xl text-ink0">My Applications</h2>
            <span className="font-dmmono text-xs text-ink2">{userApplications.length} Total</span>
          </div>

          <div className="bg-bg1 border border-ink3 rounded-xl p-5 space-y-3">
            {userApplications.length === 0 ? (
              <p className="text-xs text-ink2 text-center py-4">No active applications. Explore projects to collaborate!</p>
            ) : (
              userApplications.map((app) => (
                <div key={app.id} className="p-3 bg-bg2 rounded-lg border border-ink3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-outfit font-semibold text-xs text-ink0">{app.projectTitle}</span>
                    <span
                      className={`text-[0.65rem] font-dmmono uppercase px-2 py-0.5 rounded ${
                        app.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : app.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div className="font-dmmono text-[0.7rem] text-g-text">{app.roleName}</div>
                  <div className="text-[0.68rem] text-ink2 mt-1">Applied {new Date(app.appliedAt).toLocaleDateString()}</div>
                </div>
              ))
            )}
            <Link
              to="/explore"
              className="block text-center text-xs font-dmmono text-g hover:underline pt-2 border-t border-ink3"
            >
              Browse Open Roles in Gallery ➔
            </Link>
          </div>
        </div>

      </div>

    </section>
  );
}
