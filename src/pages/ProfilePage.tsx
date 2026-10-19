import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Project, CollaboratorApplication } from '../types';

interface ProfilePageProps {
  projects: Project[];
  applications: CollaboratorApplication[];
  onOpenCreateWizard: () => void;
}

interface StudentProfile {
  name: string;
  avatar: string;
  handle: string;
  institution: string;
  department: string;
  year: string;
  bio: string;
  github: string;
  portfolio: string;
  discord: string;
  availability: 'Available for Hackathons & Projects' | 'Busy / Focused on Exams' | 'Open for Mentorship';
  skills: string[];
  learningInterests: string[];
}

const defaultStudent: StudentProfile = {
  name: 'Frozen',
  avatar: 'https://avatars.githubusercontent.com/u/174297688?s=96&v=4',
  handle: '@frozen-dev',
  institution: 'Student Innovation Network',
  department: 'Computer Science & Engineering',
  year: 'Class of 2026',
  bio: 'Full-stack builder passionate about autonomous agents, developer utilities, and high-performance reactive web systems. Seeking collaborators for campus-scale innovation builds.',
  github: 'https://github.com/Frozen-47',
  portfolio: 'https://frozenn.in',
  discord: 'frozen#0001',
  availability: 'Available for Hackathons & Projects',
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python', 'Vector DB', 'PostgreSQL'],
  learningInterests: ['Distributed LLM Pipelines', 'pgvector Clustering', 'WebAssembly', 'Rust'],
};

// Peer collaborators data for collaborator discovery
interface PeerCollaborator {
  id: string;
  name: string;
  avatar: string;
  handle: string;
  institution: string;
  primarySkills: string[];
  recommendationReason: string;
  github: string;
  availability: string;
}

const mockPeerCollaborators: PeerCollaborator[] = [
  {
    id: 'peer-1',
    name: 'Ananya Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    handle: '@ananya-sharma',
    institution: 'Campus EcoSync Lead',
    primarySkills: ['C++', 'ESP32', 'FreeRTOS', 'MQTT', 'TimescaleDB'],
    recommendationReason: 'Complements your frontend & AI stack with hardware IoT telemetry & embedded systems.',
    github: 'https://github.com/devsnapz/campus-ecosync',
    availability: 'Available for Hardware Collabs',
  },
  {
    id: 'peer-2',
    name: 'Rohan Verma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    handle: '@rohan-verma-ml',
    institution: 'MedVision-AI Researcher',
    primarySkills: ['Python', 'PyTorch', 'ONNX', 'FastAPI', 'Computer Vision'],
    recommendationReason: 'Specializes in computer vision backbones to pair with your web client architectures.',
    github: 'https://github.com/devsnapz/medvision-ai',
    availability: 'Seeking Frontend Partners',
  },
  {
    id: 'peer-3',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    handle: '@sarahchen-dev',
    institution: 'PeerSync Maintainer',
    primarySkills: ['Rust', 'WebAssembly', 'CRDTs', 'WebRTC'],
    recommendationReason: 'Shares your interest in WebAssembly and decentralized peer sync protocols.',
    github: 'https://github.com/devsnapz/peersync',
    availability: 'Available for Hackathons',
  },
];

export default function ProfilePage({ projects, applications, onOpenCreateWizard }: ProfilePageProps) {
  // Load profile with local persistence
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('devsnapz_student_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      /* ignore */
    }
    return defaultStudent;
  });

  // Edit modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<StudentProfile>(profile);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newInterestInput, setNewInterestInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Active section tab
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'collaborators'>('overview');

  const userProjects = projects.filter(
    (p) => p.creatorName === profile.name || p.creatorGithub === 'Frozen-47'
  );
  const userApplications = applications.filter(
    (a) =>
      a.applicantName.toLowerCase().includes(profile.name.toLowerCase()) ||
      a.applicantName.toLowerCase().includes('david')
  );

  // Explainable Role Recommendations
  const recommendedRoles = useMemo(() => {
    const list: Array<{
      project: Project;
      role: { id: string; roleName: string; description: string; skillsNeeded: string[] };
      matchingSkills: string[];
      growthSkills: string[];
      matchRatio: number;
    }> = [];

    projects.forEach((proj) => {
      // Don't recommend own project
      if (proj.creatorName === profile.name) return;

      proj.openRoles?.forEach((role) => {
        if (role.status !== 'open') return;

        const matchingSkills = role.skillsNeeded.filter((skill) =>
          profile.skills.some((userSkill) => userSkill.toLowerCase() === skill.toLowerCase())
        );

        const growthSkills = role.skillsNeeded.filter(
          (skill) => !matchingSkills.includes(skill)
        );

        if (matchingSkills.length > 0) {
          list.push({
            project: proj,
            role,
            matchingSkills,
            growthSkills,
            matchRatio: matchingSkills.length / role.skillsNeeded.length,
          });
        }
      });
    });

    // Sort by most matching skills
    return list.sort((a, b) => b.matchingSkills.length - a.matchingSkills.length);
  }, [projects, profile.skills, profile.name]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editForm);
    localStorage.setItem('devsnapz_student_profile', JSON.stringify(editForm));
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !editForm.skills.includes(newSkillInput.trim())) {
      setEditForm((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkillInput.trim()],
      }));
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleAddInterest = () => {
    if (newInterestInput.trim() && !editForm.learningInterests.includes(newInterestInput.trim())) {
      setEditForm((prev) => ({
        ...prev,
        learningInterests: [...prev.learningInterests, newInterestInput.trim()],
      }));
      setNewInterestInput('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setEditForm((prev) => ({
      ...prev,
      learningInterests: prev.learningInterests.filter((i) => i !== interestToRemove),
    }));
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="student-profile" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      
      {/* Profile Header Card */}
      <div className="bg-[#151B2D]/90 border border-[#222F4C] rounded-2xl p-6 sm:p-8 mb-8 backdrop-blur-md shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#222F4C]">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ring-2 ring-[#635BFF]/40 object-cover shadow-lg shadow-[#635BFF]/10 bg-[#0B1020]"
              />
              <span
                className={`absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full border-2 border-[#151B2D] flex items-center justify-center ${
                  profile.availability.includes('Available') ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                title={profile.availability}
              />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{profile.name}</h1>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-[#635BFF]/15 text-[#9D98FF] border border-[#635BFF]/30">
                  <span className="w-2 h-2 rounded-full bg-[#635BFF] animate-pulse" />
                  {profile.availability}
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400 mt-1">
                {profile.handle} · <span className="text-slate-300">{profile.institution}</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {profile.department} · {profile.year}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2.5 flex-wrap items-center">
            <button
              onClick={() => {
                setEditForm(profile);
                setIsEditing(true);
              }}
              className="px-4 py-2 bg-[#0B1020]/80 hover:bg-[#0B1020] text-slate-200 border border-[#222F4C] hover:border-[#635BFF]/50 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </button>

            <button
              onClick={handleShareProfile}
              className="px-3.5 py-2 bg-[#0B1020]/80 hover:bg-[#0B1020] text-slate-200 border border-[#222F4C] rounded-xl text-xs font-medium transition-all"
              title="Copy Profile URL"
            >
              {copiedLink ? 'Copied!' : 'Share Profile'}
            </button>

            <button
              onClick={onOpenCreateWizard}
              className="px-4 py-2 bg-[#635BFF] hover:bg-[#5249e0] text-white rounded-xl text-xs font-semibold shadow-md shadow-[#635BFF]/25 transition-all flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5v14M5 12h14" />
              </svg>
              + Publish Project
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className="py-5">
          <div className="text-[0.68rem] font-mono uppercase tracking-wider text-slate-400 mb-1.5">About Builder</div>
          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">{profile.bio}</p>
          
          {/* External links */}
          <div className="flex items-center gap-4 mt-3 text-xs font-mono text-slate-400">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub Profile
              </a>
            )}
            {profile.portfolio && (
              <a
                href={profile.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Personal Website
              </a>
            )}
          </div>
        </div>

        {/* Skills & Learning Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-[#222F4C]">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[0.68rem] font-mono uppercase tracking-wider text-slate-400">
                Known Competencies & Stack ({profile.skills.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="font-mono text-xs bg-[#635BFF]/15 text-[#9D98FF] border border-[#635BFF]/30 px-2.5 py-1 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[0.68rem] font-mono uppercase tracking-wider text-slate-400">
                Currently Exploring / Learning Targets ({profile.learningInterests.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.learningInterests.map((interest) => (
                <span
                  key={interest}
                  className="font-mono text-xs bg-[#0B1020]/70 text-slate-300 border border-[#222F4C] px-2.5 py-1 rounded-lg"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-[#222F4C]/80 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-[#635BFF] text-white shadow-md shadow-[#635BFF]/25'
              : 'text-slate-400 hover:text-white hover:bg-[#151B2D]'
          }`}
        >
          My Projects & Applications
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'recommendations'
              ? 'bg-[#635BFF] text-white shadow-md shadow-[#635BFF]/25'
              : 'text-slate-400 hover:text-white hover:bg-[#151B2D]'
          }`}
        >
          <span>Recommended Roles</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[#F9735B] text-white text-[0.62rem]">
            {recommendedRoles.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('collaborators')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'collaborators'
              ? 'bg-[#635BFF] text-white shadow-md shadow-[#635BFF]/25'
              : 'text-slate-400 hover:text-white hover:bg-[#151B2D]'
          }`}
        >
          <span>Peer Collaborator Discovery</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[#222F4C] text-slate-300 text-[0.62rem]">
            {mockPeerCollaborators.length}
          </span>
        </button>
      </div>

      {/* TAB CONTENT 1: OVERVIEW (My Projects & Applications) */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Published Projects */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Published Projects</h2>
              <span className="text-xs font-mono text-slate-400">{userProjects.length} Active</span>
            </div>

            {userProjects.length === 0 ? (
              <div className="bg-[#151B2D]/80 border border-[#222F4C] rounded-2xl p-8 text-center text-sm text-slate-400">
                No projects published yet. Click "Publish Project" to showcase your innovation!
              </div>
            ) : (
              <div className="space-y-4">
                {userProjects.map((p) => (
                  <div
                    key={p.id}
                    className="bg-[#151B2D]/90 border border-[#222F4C] hover:border-[#635BFF]/40 rounded-2xl p-5 transition-all shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          to={`/projects/${p.id}`}
                          className="font-bold text-lg text-white hover:text-[#635BFF] transition-colors"
                        >
                          {p.title}
                        </Link>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{p.pitch}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {p.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="text-[0.68rem] font-mono bg-[#0B1020]/60 text-slate-300 px-2 py-0.5 rounded border border-[#222F4C]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Link
                        to={`/projects/${p.id}`}
                        className="text-xs font-semibold text-[#635BFF] hover:text-[#817AFF] whitespace-nowrap pt-1 flex items-center gap-1"
                      >
                        Project Hub ➔
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outgoing Applications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">My Applications</h2>
              <span className="text-xs font-mono text-slate-400">{userApplications.length} Total</span>
            </div>

            <div className="bg-[#151B2D]/90 border border-[#222F4C] rounded-2xl p-5 space-y-3 shadow-md">
              {userApplications.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">
                  No active applications. Explore projects in the directory to find open roles!
                </p>
              ) : (
                userApplications.map((app) => (
                  <div key={app.id} className="p-3.5 bg-[#0B1020]/70 rounded-xl border border-[#222F4C]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-xs text-white truncate max-w-[160px]">{app.projectTitle}</span>
                      <span
                        className={`text-[0.62rem] font-mono uppercase px-2 py-0.5 rounded-full ${
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
                    <div className="text-xs text-[#9D98FF] font-medium">{app.roleName}</div>
                    <div className="text-[0.68rem] text-slate-400 mt-1">
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}

              <Link
                to="/explore"
                className="block text-center text-xs font-medium text-[#635BFF] hover:text-[#817AFF] pt-3 border-t border-[#222F4C]/70"
              >
                Browse Open Roles in Directory ➔
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: EXPLAINABLE AI ROLE RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="bg-[#151B2D]/80 border border-[#222F4C] rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#635BFF]/15 border border-[#635BFF]/30 flex items-center justify-center text-[#635BFF] flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Explainable Skill Matching Engine</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  These open positions directly match your known competencies. We calculate transparent skill alignment without opaque chatbots or arbitrary percentage scores.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedRoles.map(({ project, role, matchingSkills, growthSkills }) => (
              <div
                key={role.id}
                className="bg-[#151B2D]/90 border border-[#222F4C] hover:border-[#635BFF]/50 rounded-2xl p-6 transition-all shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-slate-400 truncate">{project.title}</span>
                    <span className="text-[0.62rem] font-mono px-2 py-0.5 rounded-full bg-[#635BFF]/15 text-[#9D98FF] border border-[#635BFF]/30">
                      High Skill Alignment
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{role.roleName}</h3>
                  <p className="text-xs text-slate-300 mb-4 line-clamp-2 leading-relaxed">{role.description}</p>

                  {/* Matching Rationale Box */}
                  <div className="p-3 rounded-xl bg-[#0B1020]/70 border border-[#222F4C] mb-4 space-y-2">
                    <div>
                      <div className="text-[0.65rem] font-mono text-emerald-400 flex items-center gap-1 mb-1 font-semibold">
                        <span>✓</span> MATCHING SKILLS ({matchingSkills.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {matchingSkills.map((s) => (
                          <span
                            key={s}
                            className="text-[0.62rem] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 font-mono"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {growthSkills.length > 0 && (
                      <div>
                        <div className="text-[0.65rem] font-mono text-[#F9735B] flex items-center gap-1 mb-1 font-semibold">
                          <span>★</span> GROWTH OPPORTUNITY ({growthSkills.length})
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {growthSkills.map((s) => (
                            <span
                              key={s}
                              className="text-[0.62rem] px-2 py-0.5 rounded bg-[#F9735B]/10 text-coral-300 border border-[#F9735B]/25 font-mono text-orange-300"
                            >
                              Learn {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#222F4C]/70 flex items-center justify-between">
                  <div className="text-[0.68rem] text-slate-400">
                    Lead: <span className="text-slate-300 font-medium">@{project.creatorGithub || project.creatorName}</span>
                  </div>
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-xs font-semibold text-[#635BFF] hover:text-[#817AFF] flex items-center gap-1"
                  >
                    View in Project Hub ➔
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: COLLABORATOR DISCOVERY */}
      {activeTab === 'collaborators' && (
        <div className="space-y-6">
          <div className="bg-[#151B2D]/80 border border-[#222F4C] rounded-2xl p-5 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white">Suggested Peer Builders</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Connect with fellow student engineers whose expertise complements your own for hackathon squads, research papers, and open-source initiatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockPeerCollaborators.map((collab) => (
              <div
                key={collab.id}
                className="bg-[#151B2D]/90 border border-[#222F4C] hover:border-[#635BFF]/50 rounded-2xl p-5 transition-all shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <img
                      src={collab.avatar}
                      alt={collab.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#222F4C] bg-[#0B1020]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{collab.name}</h4>
                      <div className="text-[0.68rem] font-mono text-slate-400">{collab.handle}</div>
                      <div className="text-[0.65rem] text-[#9D98FF] font-medium">{collab.institution}</div>
                    </div>
                  </div>

                  {/* Recommendation Rationale */}
                  <div className="p-3 rounded-xl bg-[#0B1020]/60 border border-[#222F4C] mb-4">
                    <div className="text-[0.62rem] font-mono uppercase tracking-wider text-[#F9735B] font-semibold mb-1">
                      Why Recommended
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{collab.recommendationReason}</p>
                  </div>

                  {/* Tech stack */}
                  <div className="mb-4">
                    <div className="text-[0.65rem] font-mono text-slate-400 mb-1.5 uppercase">Primary Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {collab.primarySkills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[0.65rem] font-mono px-2 py-0.5 rounded bg-[#0B1020] border border-[#222F4C] text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#222F4C]/70 flex items-center justify-between">
                  <span className="text-[0.65rem] font-mono text-emerald-400">{collab.availability}</span>
                  <a
                    href={collab.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#635BFF] hover:text-[#817AFF]"
                  >
                    View Work ➔
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#151B2D] border border-[#222F4C] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#222F4C] mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Edit Student Profile</h3>
                <p className="text-xs text-slate-400 mt-0.5">Update your builder info and skill matrix</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1020] border border-[#222F4C] rounded-xl text-sm text-white focus:outline-none focus:border-[#635BFF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">University / Institution</label>
                  <input
                    type="text"
                    value={editForm.institution}
                    onChange={(e) => setEditForm({ ...editForm, institution: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1020] border border-[#222F4C] rounded-xl text-sm text-white focus:outline-none focus:border-[#635BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Availability Status</label>
                <select
                  value={editForm.availability}
                  onChange={(e) => setEditForm({ ...editForm, availability: e.target.value as StudentProfile['availability'] })}
                  className="w-full px-3 py-2 bg-[#0B1020] border border-[#222F4C] rounded-xl text-sm text-white focus:outline-none focus:border-[#635BFF]"
                >
                  <option value="Available for Hackathons & Projects">Available for Hackathons & Projects</option>
                  <option value="Busy / Focused on Exams">Busy / Focused on Exams</option>
                  <option value="Open for Mentorship">Open for Mentorship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Bio</label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0B1020] border border-[#222F4C] rounded-xl text-sm text-white focus:outline-none focus:border-[#635BFF] resize-none"
                />
              </div>

              {/* Known Skills Management */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Known Competencies</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add skill (e.g. Next.js, Docker)"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="flex-grow px-3 py-1.5 bg-[#0B1020] border border-[#222F4C] rounded-xl text-xs text-white focus:outline-none focus:border-[#635BFF]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 bg-[#635BFF] text-white text-xs font-medium rounded-xl hover:bg-[#5249e0]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-[#0B1020]/50 rounded-xl border border-[#222F4C]/60">
                  {editForm.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 text-xs font-mono bg-[#635BFF]/15 text-[#9D98FF] border border-[#635BFF]/30 px-2.5 py-0.5 rounded-lg"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-white ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Learning Interests Management */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Learning Targets</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add learning target (e.g. Rust, PyTorch)"
                    value={newInterestInput}
                    onChange={(e) => setNewInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInterest();
                      }
                    }}
                    className="flex-grow px-3 py-1.5 bg-[#0B1020] border border-[#222F4C] rounded-xl text-xs text-white focus:outline-none focus:border-[#635BFF]"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="px-3 py-1.5 bg-[#635BFF] text-white text-xs font-medium rounded-xl hover:bg-[#5249e0]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-[#0B1020]/50 rounded-xl border border-[#222F4C]/60">
                  {editForm.learningInterests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1.5 text-xs font-mono bg-[#0B1020] text-slate-300 border border-[#222F4C] px-2.5 py-0.5 rounded-lg"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(interest)}
                        className="text-slate-400 hover:text-white ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">GitHub URL</label>
                  <input
                    type="url"
                    value={editForm.github}
                    onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1020] border border-[#222F4C] rounded-xl text-sm text-white focus:outline-none focus:border-[#635BFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">Portfolio / Website</label>
                  <input
                    type="url"
                    value={editForm.portfolio}
                    onChange={(e) => setEditForm({ ...editForm, portfolio: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1020] border border-[#222F4C] rounded-xl text-sm text-white focus:outline-none focus:border-[#635BFF]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222F4C]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#635BFF] hover:bg-[#5249e0] text-white text-xs font-semibold rounded-xl shadow-md shadow-[#635BFF]/25 transition-all"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
