import React, { useState, useMemo } from 'react';
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
  location: string;
  availability: 'Available for Hackathons & Projects' | 'Busy / Focused on Exams' | 'Open for Mentorship';
  skills: string[];
  learningInterests: string[];
}

const defaultStudent: StudentProfile = {
  name: 'Frozen',
  avatar: 'https://avatars.githubusercontent.com/u/174297688?s=96&v=4',
  handle: 'Frozen-47',
  institution: 'Student Innovation Network',
  department: 'Computer Science & Engineering',
  year: 'Class of 2026',
  location: 'Bangalore, India',
  bio: 'Full-stack builder passionate about autonomous agents, developer utilities, and high-performance reactive web systems. Open for campus hackathons and open-source systems.',
  github: 'https://github.com/Frozen-47',
  portfolio: 'https://frozenn.in',
  discord: 'frozen#0001',
  availability: 'Available for Hackathons & Projects',
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python', 'Vector DB', 'PostgreSQL'],
  learningInterests: ['Distributed LLM Pipelines', 'pgvector Clustering', 'WebAssembly', 'Rust'],
};

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
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('devsnapz_student_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      /* ignore */
    }
    return defaultStudent;
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'repositories' | 'gaps' | 'peers'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<StudentProfile>(profile);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newInterestInput, setNewInterestInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

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

  // Mock 52-week activity cells generator (GitHub contribution heatmap)
  const heatmapColumns = useMemo(() => {
    const cols = [];
    const colorLevels = [
      'bg-[#161b22]',                      // Level 0 (no contribution)
      'bg-[#0e4429] dark:bg-[#0c2d6b]',    // Level 1 (Tritanopia Cyan base)
      'bg-[#006d32] dark:bg-[#1158c7]',    // Level 2
      'bg-[#26a641] dark:bg-[#388bfd]',    // Level 3
      'bg-[#39d353] dark:bg-[#79c0ff]',    // Level 4 (Highest)
    ];

    for (let c = 0; c < 50; c++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        // pseudo-random contribution intensity
        const seed = (c * 7 + d * 13) % 17;
        const level = seed < 7 ? 0 : seed < 11 ? 1 : seed < 14 ? 2 : seed < 16 ? 3 : 4;
        days.push(colorLevels[level]);
      }
      cols.push(days);
    }
    return cols;
  }, []);

  const tabItemClass = (tab: 'overview' | 'repositories' | 'gaps' | 'peers') =>
    `flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
      activeTab === tab
        ? 'border-[#ff7b72] text-[#f0f6fc] font-semibold'
        : 'border-transparent text-[#9198a1] hover:text-[#f0f6fc] hover:border-[#656c76]'
    }`;

  return (
    <div className="bg-[#0d1117] min-h-screen text-[#f0f6fc]">
      
      {/* GitHub Profile Navigation Sub-bar */}
      <div className="border-b border-[#3d444d] bg-[#0d1117] sticky top-14 z-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto">
          
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={tabItemClass('overview')}
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
              <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25ZM1.5 6.5h13V1.75a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25ZM14.5 8h-13v6.25c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25Z" />
            </svg>
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('repositories')}
            className={tabItemClass('repositories')}
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
              <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
            </svg>
            <span>Repositories</span>
            <span className="bg-[#30363d] text-[#f0f6fc] rounded-full px-1.5 py-0.2 text-[10px] font-mono">
              {userProjects.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gaps')}
            className={tabItemClass('gaps')}
          >
            <span className="text-[#ff7b72]">⚡</span>
            <span>Recommended Roles</span>
            <span className="bg-[#30363d] text-[#f0f6fc] rounded-full px-1.5 py-0.2 text-[10px] font-mono">
              {recommendedRoles.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('peers')}
            className={tabItemClass('peers')}
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
              <path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4.002 4.002 0 0 0-7.899 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.512.924.75.75 0 0 1-.924-.513 3.51 3.51 0 0 0-2.316-2.52.75.75 0 0 1-.482-.72 1.5 1.5 0 1 0-2.091-1.393.75.75 0 0 1-.741-.75A3 3 0 0 1 11 4Zm-5.5 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
            </svg>
            <span>Peer Discovery</span>
            <span className="bg-[#30363d] text-[#f0f6fc] rounded-full px-1.5 py-0.2 text-[10px] font-mono">
              {mockPeerCollaborators.length}
            </span>
          </button>

        </div>
      </div>

      {/* GitHub Profile Main 2-Column Container */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* =============================================================== */}
          {/* LEFT COLUMN: GITHUB USER PROFILE SIDEBAR (approx 296px / 4 cols)*/}
          {/* =============================================================== */}
          <aside className="md:col-span-4 lg:col-span-3 space-y-4">
            
            {/* Avatar & Online Availability Pill */}
            <div className="relative inline-block w-full">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-48 h-48 sm:w-64 sm:h-64 md:w-full md:h-auto aspect-square rounded-full object-cover ring-1 ring-[#3d444d] bg-[#151b23] mx-auto md:mx-0 shadow-lg"
              />
              <span
                className="absolute bottom-2 right-4 sm:right-6 md:right-3 px-2 py-0.5 rounded-full bg-[#151b23] border border-[#3d444d] text-[11px] font-medium flex items-center gap-1.5 shadow-md"
                title={profile.availability}
              >
                <span className="w-2 h-2 rounded-full bg-[#79c0ff]" />
                <span className="hidden sm:inline">Active</span>
              </span>
            </div>

            {/* Names & Bio */}
            <div>
              <h1 className="text-2xl font-bold text-[#f0f6fc] leading-tight">
                {profile.name}
              </h1>
              <div className="text-lg font-light text-[#9198a1] font-mono">
                {profile.handle}
              </div>
              <p className="text-xs text-[#f0f6fc] mt-3 leading-relaxed">
                {profile.bio}
              </p>
            </div>

            {/* Edit Profile Button (Full Width Primer Button) */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setEditForm(profile);
                  setIsEditing(true);
                }}
                className="w-full py-1.5 px-3 bg-[#21262d] hover:bg-[#30363d] border border-[#3d444d] rounded-md text-xs font-semibold text-[#f0f6fc] shadow-xs transition-colors"
              >
                Edit profile
              </button>

              <button
                type="button"
                onClick={handleShareProfile}
                className="w-full py-1 px-3 bg-[#151b23] hover:bg-[#21262d] border border-[#3d444d] rounded-md text-[11px] font-medium text-[#9198a1] hover:text-[#f0f6fc] transition-colors"
              >
                {copiedLink ? '✓ Copied Profile URL' : 'Share profile'}
              </button>
            </div>

            {/* Followers / Following Stats */}
            <div className="flex items-center gap-2 text-xs text-[#9198a1]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                <path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4.002 4.002 0 0 0-7.899 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.512.924.75.75 0 0 1-.924-.513 3.51 3.51 0 0 0-2.316-2.52.75.75 0 0 1-.482-.72 1.5 1.5 0 1 0-2.091-1.393.75.75 0 0 1-.741-.75A3 3 0 0 1 11 4Zm-5.5 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
              </svg>
              <span><strong className="text-[#f0f6fc]">42</strong> followers</span>
              <span>·</span>
              <span><strong className="text-[#f0f6fc]">18</strong> following</span>
            </div>

            {/* Profile Metadata */}
            <div className="space-y-2 pt-2 border-t border-[#3d444d] text-xs text-[#f0f6fc]">
              <div className="flex items-center gap-2">
                <span className="text-[#9198a1]">🏢</span>
                <span className="truncate">{profile.institution}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#9198a1]">📍</span>
                <span>{profile.location}</span>
              </div>
              {profile.portfolio && (
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[#9198a1]">🔗</span>
                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#58a6ff] hover:underline truncate"
                  >
                    {profile.portfolio}
                  </a>
                </div>
              )}
              {profile.github && (
                <div className="flex items-center gap-2">
                  <span className="text-[#9198a1]">🐙</span>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#58a6ff] hover:underline"
                  >
                    @{profile.handle}
                  </a>
                </div>
              )}
            </div>

            {/* GitHub Achievements Badges */}
            <div className="pt-3 border-t border-[#3d444d] space-y-2">
              <h3 className="font-bold text-xs text-[#f0f6fc]">Achievements</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-1 rounded bg-[#151b23] border border-[#3d444d] text-xs flex items-center gap-1.5" title="Arctic Code Vault Contributor">
                  <span>❄️</span>
                  <span className="text-[11px] font-medium text-[#9198a1]">Arctic Vault</span>
                </span>
                <span className="px-2 py-1 rounded bg-[#151b23] border border-[#3d444d] text-xs flex items-center gap-1.5" title="Pull Shark">
                  <span>🦈</span>
                  <span className="text-[11px] font-medium text-[#9198a1]">Pull Shark</span>
                </span>
                <span className="px-2 py-1 rounded bg-[#151b23] border border-[#3d444d] text-xs flex items-center gap-1.5" title="Quickdraw">
                  <span>⚡</span>
                  <span className="text-[11px] font-medium text-[#9198a1]">Quickdraw</span>
                </span>
              </div>
            </div>

            {/* Known Stack Chips (Tritanopia Cyan) */}
            <div className="pt-3 border-t border-[#3d444d] space-y-2">
              <h3 className="font-bold text-xs text-[#f0f6fc]">Verified Competencies</h3>
              <div className="flex flex-wrap gap-1">
                {profile.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-[rgba(56,139,253,0.15)] text-[#79c0ff] border border-[rgba(56,139,253,0.3)] text-[11px] font-mono">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

          </aside>

          {/* =============================================================== */}
          {/* RIGHT COLUMN: GITHUB USER OVERVIEW CONTENT (approx 8-9 cols)     */}
          {/* =============================================================== */}
          <main className="md:col-span-8 lg:col-span-9 space-y-8">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <>
                {/* 1. PINNED REPOSITORIES SECTION (GitHub 2-column Grid) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <h2 className="font-semibold text-sm text-[#f0f6fc]">Pinned</h2>
                    <button
                      type="button"
                      onClick={onOpenCreateWizard}
                      className="text-[#58a6ff] hover:underline font-medium"
                    >
                      + New Repository
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userProjects.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 border border-[#3d444d] rounded-md bg-[#151b23] flex flex-col justify-between hover:border-[#58a6ff]/50 transition-colors shadow-xs"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-sm">{p.icon || '📁'}</span>
                              <Link
                                to={`/projects/${p.id}`}
                                className="font-semibold text-sm text-[#58a6ff] hover:underline truncate"
                              >
                                {p.title}
                              </Link>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full border border-[#3d444d] text-[#9198a1]">
                              Public
                            </span>
                          </div>

                          <p className="text-xs text-[#9198a1] line-clamp-2 leading-relaxed mb-3">
                            {p.pitch}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-[#9198a1] pt-2 border-t border-[#3d444d]/40">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#3178c6]" />
                            <span className="text-[11px] font-mono">{p.techStack[0] || 'TypeScript'}</span>
                          </span>
                          <span className="flex items-center gap-1 text-[11px]">
                            <span>★</span> 38
                          </span>
                          <span className="flex items-center gap-1 text-[11px]">
                            <span>⑂</span> 4
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. GITHUB 52-WEEK CONTRIBUTION ACTIVITY HEATMAP GRAPH */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <h2 className="font-semibold text-sm text-[#f0f6fc]">
                      384 contributions in the last year
                    </h2>
                    <span className="text-[#9198a1] font-mono text-xs">Contribution settings ▾</span>
                  </div>

                  <div className="p-4 border border-[#3d444d] rounded-md bg-[#151b23] overflow-x-auto">
                    <div className="inline-flex gap-1">
                      {heatmapColumns.map((col, cIdx) => (
                        <div key={cIdx} className="flex flex-col gap-1">
                          {col.map((colorClass, dIdx) => (
                            <div
                              key={dIdx}
                              className={`w-2.5 h-2.5 rounded-[2px] ${colorClass}`}
                              title={`Activity on week ${cIdx + 1}, day ${dIdx + 1}`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Heatmap Legend */}
                    <div className="flex items-center justify-between text-[11px] text-[#9198a1] pt-3 mt-3 border-t border-[#3d444d]">
                      <a href="#activity" className="text-[#58a6ff] hover:underline">
                        Learn how we count contributions
                      </a>
                      <div className="flex items-center gap-1.5">
                        <span>Less</span>
                        <span className="w-2.5 h-2.5 rounded-[2px] bg-[#161b22]" />
                        <span className="w-2.5 h-2.5 rounded-[2px] bg-[#0c2d6b]" />
                        <span className="w-2.5 h-2.5 rounded-[2px] bg-[#1158c7]" />
                        <span className="w-2.5 h-2.5 rounded-[2px] bg-[#388bfd]" />
                        <span className="w-2.5 h-2.5 rounded-[2px] bg-[#79c0ff]" />
                        <span>More</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. CONTRIBUTION ACTIVITY TIMELINE */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-[#f0f6fc]">Contribution activity</h3>
                  
                  <div className="border border-[#3d444d] rounded-md bg-[#151b23] divide-y divide-[#3d444d] text-xs">
                    <div className="p-4 flex items-start gap-3">
                      <span className="text-base text-[#79c0ff] mt-0.5">📦</span>
                      <div className="space-y-1">
                        <div className="font-bold text-[#f0f6fc]">
                          Created 2 repositories
                        </div>
                        <div className="text-[#9198a1] text-xs">
                          {userProjects.map((p) => (
                            <Link key={p.id} to={`/projects/${p.id}`} className="text-[#58a6ff] hover:underline block">
                              {p.id} · {p.pitch}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex items-start gap-3">
                      <span className="text-base text-[#ff7b72] mt-0.5">⚡</span>
                      <div className="space-y-1">
                        <div className="font-bold text-[#f0f6fc]">
                          Flagged 3 engineering skill gaps
                        </div>
                        <p className="text-xs text-[#9198a1]">
                          Campus EcoSync · MedVision-AI · StudyMate AI
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* REPOSITORIES TAB */}
            {activeTab === 'repositories' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#3d444d]">
                  <input
                    type="text"
                    placeholder="Find a repository..."
                    className="px-3 py-1.5 bg-[#010409] border border-[#3d444d] rounded-md text-xs text-[#f0f6fc] w-72 focus:outline-none focus:border-[#58a6ff]"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={onOpenCreateWizard}
                    className="px-3 py-1.5 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md text-xs shadow-xs"
                  >
                    + New
                  </button>
                </div>

                <div className="divide-y divide-[#3d444d] border border-[#3d444d] rounded-md bg-[#151b23]">
                  {userProjects.map((p) => (
                    <div key={p.id} className="p-4 flex items-start justify-between gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/projects/${p.id}`}
                            className="font-bold text-base text-[#58a6ff] hover:underline"
                          >
                            {p.id}
                          </Link>
                          <span className="text-[10px] font-mono border border-[#3d444d] rounded-full px-2 py-0.2 text-[#9198a1]">
                            Public
                          </span>
                        </div>
                        <p className="text-xs text-[#9198a1] mt-1.5 max-w-xl">{p.pitch}</p>
                        
                        <div className="flex items-center gap-4 text-[11px] text-[#9198a1] mt-3">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#3178c6]" />
                            <span className="font-mono">{p.techStack[0] || 'TypeScript'}</span>
                          </span>
                          <span>★ 38</span>
                          <span>Updated 3 hours ago</span>
                        </div>
                      </div>

                      <Link
                        to={`/projects/${p.id}`}
                        className="px-3 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#3d444d] rounded-md text-xs font-semibold text-[#f0f6fc] whitespace-nowrap"
                      >
                        Star
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RECOMMENDED ROLES TAB */}
            {activeTab === 'gaps' && (
              <div className="space-y-4">
                <div className="border border-[#3d444d] rounded-md bg-[#151b23] p-4 text-xs text-[#9198a1] space-y-1">
                  <div className="font-bold text-sm text-[#f0f6fc] flex items-center gap-1.5">
                    <span className="text-[#58a6ff]">⚡</span>
                    <span>Explainable Skill-Matching Algorithm</span>
                  </div>
                  <p>
                    Open positions across student repositories that directly align with your verified competencies.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendedRoles.map(({ project, role, matchingSkills, growthSkills }) => (
                    <div
                      key={role.id}
                      className="p-4 border border-[#3d444d] rounded-md bg-[#151b23] flex flex-col justify-between text-xs space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] text-[#9198a1] truncate">{project.title}</span>
                          <span className="px-2 py-0.2 rounded-full bg-[rgba(56,139,253,0.15)] text-[#79c0ff] border border-[rgba(56,139,253,0.3)] text-[10px] font-mono">
                            Match
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-[#f0f6fc] mt-1">{role.roleName}</h4>
                        <p className="text-[#9198a1] mt-1 line-clamp-2">{role.description}</p>

                        <div className="mt-3 space-y-2 pt-2 border-t border-[#3d444d]">
                          <div>
                            <span className="text-[10px] font-mono text-[#79c0ff] block mb-1">✓ MATCHING SKILLS</span>
                            <div className="flex flex-wrap gap-1">
                              {matchingSkills.map((s) => (
                                <span key={s} className="px-1.5 py-0.2 rounded bg-[rgba(56,139,253,0.15)] text-[#79c0ff] border border-[rgba(56,139,253,0.3)] font-mono text-[10px]">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          {growthSkills.length > 0 && (
                            <div>
                              <span className="text-[10px] font-mono text-[#ff7b72] block mb-1">⚡ GROWTH OPPORTUNITY</span>
                              <div className="flex flex-wrap gap-1">
                                {growthSkills.map((s) => (
                                  <span key={s} className="px-1.5 py-0.2 rounded bg-[rgba(248,81,73,0.15)] text-[#ff7b72] border border-[rgba(248,81,73,0.4)] font-mono text-[10px]">
                                    Learn {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <Link
                          to={`/projects/${project.id}`}
                          className="text-[#58a6ff] hover:underline font-semibold"
                        >
                          View Repository ➔
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PEER COLLABORATOR DISCOVERY TAB */}
            {activeTab === 'peers' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockPeerCollaborators.map((c) => (
                  <div key={c.id} className="p-4 border border-[#3d444d] rounded-md bg-[#151b23] flex flex-col justify-between text-xs space-y-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-[#3d444d]" />
                        <div>
                          <div className="font-bold text-sm text-[#f0f6fc]">{c.name}</div>
                          <div className="text-[11px] font-mono text-[#9198a1]">{c.handle}</div>
                        </div>
                      </div>

                      <p className="text-xs text-[#9198a1] mt-3">{c.recommendationReason}</p>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {c.primarySkills.map((s) => (
                          <span key={s} className="px-1.5 py-0.2 rounded bg-[#21262d] border border-[#3d444d] font-mono text-[10px] text-[#f0f6fc]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#3d444d] flex items-center justify-between">
                      <span className="text-[#79c0ff] text-[11px] font-medium">{c.availability}</span>
                      <a href={c.github} target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline">
                        Profile ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </main>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#151b23] border border-[#3d444d] rounded-md w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 text-xs text-[#f0f6fc] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#3d444d] mb-4">
              <h3 className="font-bold text-sm text-[#f0f6fc]">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-[#9198a1] hover:text-[#f0f6fc] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9198a1] font-mono uppercase text-[11px] mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#010409] border border-[#3d444d] rounded-md text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>
                <div>
                  <label className="block text-[#9198a1] font-mono uppercase text-[11px] mb-1">Institution</label>
                  <input
                    type="text"
                    value={editForm.institution}
                    onChange={(e) => setEditForm({ ...editForm, institution: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#010409] border border-[#3d444d] rounded-md text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#9198a1] font-mono uppercase text-[11px] mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#010409] border border-[#3d444d] rounded-md text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] resize-none"
                />
              </div>

              {/* Known Skills Management */}
              <div>
                <label className="block text-[#9198a1] font-mono uppercase text-[11px] mb-1">Known Competencies</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add skill (e.g. Docker, Rust)"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="flex-grow px-3 py-1.5 bg-[#010409] border border-[#3d444d] rounded-md text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#3d444d] rounded-md font-semibold text-[#f0f6fc]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 p-2 bg-[#010409] border border-[#3d444d] rounded-md max-h-24 overflow-y-auto">
                  {editForm.skills.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded bg-[rgba(56,139,253,0.15)] text-[#79c0ff] border border-[rgba(56,139,253,0.3)] font-mono text-[10px] flex items-center gap-1">
                      {skill}
                      <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-[#9198a1] hover:text-[#f0f6fc]">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#3d444d]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 border border-[#3d444d] rounded-md text-[#9198a1] hover:text-[#f0f6fc]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md shadow-xs"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
