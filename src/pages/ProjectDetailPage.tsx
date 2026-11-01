import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Project, OpenRole, SponsorshipTier } from '../types';

interface ProjectDetailPageProps {
  projects: Project[];
  onApplyToCollaborate: (application: {
    projectId: string;
    roleName: string;
    applicantName: string;
    applicantEmail: string;
    skills: string;
    message: string;
  }) => void;
  onSponsorProject: (sponsorship: {
    projectId: string;
    amount: number;
    sponsorName: string;
    message: string;
  }) => void;
  onAddGuidanceTopic: (projectId: string, question: string) => void;
  onReplyToGuidance: (projectId: string, topicId: string, replyText: string) => void;
  onClaimIssue: (projectId: string, issueId: string) => void;
}

type TabType = 'collaborate' | 'guide' | 'contribute' | 'sponsor';

export default function ProjectDetailPage({
  projects,
  onApplyToCollaborate,
  onSponsorProject,
  onAddGuidanceTopic,
  onReplyToGuidance,
  onClaimIssue,
}: ProjectDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);

  const [activeTab, setActiveTab] = useState<TabType>('collaborate');

  // Application Form State
  const [selectedRole, setSelectedRole] = useState<OpenRole | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantSkills, setApplicantSkills] = useState('');
  const [applicantMessage, setApplicantMessage] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  // Guidance Q&A State
  const [newQuestion, setNewQuestion] = useState('');
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});

  // Sponsor State
  const [selectedTier, setSelectedTier] = useState<SponsorshipTier | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorMessage, setSponsorMessage] = useState('');
  const [sponsorSuccess, setSponsorSuccess] = useState(false);

  if (!project) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-12 max-w-md mx-auto shadow-xs">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="font-bold text-2xl text-[#111827] dark:text-[#f0f6fc] mb-2">Project Not Found</h2>
          <p className="text-sm text-[#6B7280] dark:text-[#9198a1] mb-6">
            The project you are looking for may have been removed or does not exist.
          </p>
          <Link
            to="/explore"
            className="bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold px-5 py-2.5 rounded-xl text-xs font-sans inline-flex items-center gap-2 shadow-xs transition-all"
          >
            ← Back to Explore Directory
          </Link>
        </div>
      </div>
    );
  }

  // Derive skill gaps from open roles
  const openRolesList = project.openRoles || [];
  const activeOpenRoles = openRolesList.filter((r) => r.status === 'open');
  const allGapSkills = Array.from(
    new Set(activeOpenRoles.flatMap((r) => r.skillsNeeded))
  );

  // Derive known team skills (tech stack minus the open gap skills)
  const knownSkills = project.techStack.filter(
    (t) => !allGapSkills.map((s) => s.toLowerCase()).includes(t.toLowerCase())
  );

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !applicantName.trim() || !applicantEmail.trim()) return;

    onApplyToCollaborate({
      projectId: project.id,
      roleName: selectedRole.roleName,
      applicantName,
      applicantEmail,
      skills: applicantSkills,
      message: applicantMessage,
    });

    setApplicationSuccess(true);
    setTimeout(() => {
      setSelectedRole(null);
      setApplicantName('');
      setApplicantEmail('');
      setApplicantSkills('');
      setApplicantMessage('');
      setApplicationSuccess(false);
    }, 2500);
  };

  const handleAddQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    onAddGuidanceTopic(project.id, newQuestion);
    setNewQuestion('');
  };

  const handleReplySubmit = (topicId: string) => {
    const text = replyInput[topicId];
    if (!text || !text.trim()) return;
    onReplyToGuidance(project.id, topicId, text);
    setReplyInput((prev) => ({ ...prev, [topicId]: '' }));
  };

  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = selectedTier ? selectedTier.amount : parseFloat(customAmount);
    if (!amount || amount <= 0 || !sponsorName.trim()) return;

    onSponsorProject({
      projectId: project.id,
      amount,
      sponsorName,
      message: sponsorMessage,
    });

    setSponsorSuccess(true);
    setTimeout(() => {
      setSelectedTier(null);
      setCustomAmount('');
      setSponsorName('');
      setSponsorMessage('');
      setSponsorSuccess(false);
    }, 2500);
  };

  const tabButtonClass = (tab: TabType) =>
    `font-sans text-xs px-4 py-2 rounded-xl transition-all ${
      activeTab === tab
        ? 'bg-[#F3F1FF] dark:bg-[rgba(56,139,253,0.15)] text-[#1f6feb] dark:text-[#58a6ff] font-semibold border border-[#1f6feb]/30 dark:border-[#1f6feb]/50 shadow-xs'
        : 'text-[#6B7280] dark:text-[#9198a1] hover:text-[#111827] dark:hover:text-[#f0f6fc] hover:bg-[#F7F8FC] dark:hover:bg-[#151b23] border border-transparent font-medium'
    }`;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8 sm:py-12 relative z-10">
      
      {/* Top Breadcrumb & Return Link */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-xs font-sans text-[#6B7280] dark:text-[#9198a1] hover:text-[#111827] dark:hover:text-[#f0f6fc] transition-colors"
        >
          <span>←</span>
          <span>Back to Explore Directory</span>
        </Link>
        <span className="text-xs font-mono text-[#9CA3AF] dark:text-[#656c76]">
          ID: {project.id}
        </span>
      </div>

      {/* Hero Banner Card */}
      <div className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl overflow-hidden shadow-xs mb-8">
        <div className={`h-36 sm:h-44 bg-gradient-to-r ${project.bannerGradient || 'from-indigo-600 via-purple-600 to-pink-600'} relative p-6 flex flex-col justify-between`}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
          
          <div className="relative z-10 flex items-center justify-between gap-4">
            <span className="font-sans text-xs font-semibold text-[#111827] dark:text-[#f0f6fc] bg-white/90 dark:bg-[#151b23]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/40 dark:border-[#3d444d] shadow-xs flex items-center gap-2">
              <span>{project.icon || '🚀'}</span>
              <span>DevSnapz Showcase</span>
            </span>
            <div className="flex items-center gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs font-semibold bg-white/90 dark:bg-[#151b23]/90 hover:bg-white dark:hover:bg-[#151b23] text-[#111827] dark:text-[#f0f6fc] px-3.5 py-1.5 rounded-xl border border-white/40 dark:border-[#3d444d] transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <span>Live Demo</span>
                  <span className="text-xs">↗</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs font-semibold bg-white/90 dark:bg-[#151b23]/90 hover:bg-white dark:hover:bg-[#151b23] text-[#111827] dark:text-[#f0f6fc] px-3.5 py-1.5 rounded-xl border border-white/40 dark:border-[#3d444d] transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <span>GitHub</span>
                  <span className="text-xs">↗</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Project Header Info */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#E5E7EB] dark:border-[#3d444d]">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-2xl">{project.icon || '📦'}</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#f0f6fc] leading-tight">
                  {project.title}
                </h1>
              </div>
              <p className="text-base text-[#6B7280] dark:text-[#9198a1] font-normal max-w-2xl leading-relaxed">
                {project.pitch}
              </p>
            </div>

            {/* Creator Badge */}
            <div className="flex items-center gap-3 bg-[#F7F8FC] dark:bg-[#010409] border border-[#E5E7EB] dark:border-[#3d444d] px-4 py-2.5 rounded-2xl self-start">
              <img
                src={project.creatorAvatar}
                alt={project.creatorName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#1f6feb]/30 dark:ring-[#1f6feb]/50 bg-white dark:bg-[#151b23]"
              />
              <div>
                <div className="text-[0.68rem] font-mono text-[#9CA3AF] dark:text-[#656c76] uppercase font-semibold">Project Lead</div>
                <div className="font-bold text-sm text-[#111827] dark:text-[#f0f6fc]">{project.creatorName}</div>
                {project.creatorGithub && (
                  <a
                    href={`https://github.com/${project.creatorGithub}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.72rem] font-mono text-[#1f6feb] dark:text-[#58a6ff] hover:underline"
                  >
                    @{project.creatorGithub}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="py-6">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[#9CA3AF] dark:text-[#656c76] font-semibold mb-2">
              Project Overview
            </h2>
            <p className="text-sm text-[#4B5563] dark:text-[#9198a1] leading-relaxed max-w-3xl">
              {project.description}
            </p>
          </div>

          {/* ========================================================= */}
          {/* SIGNATURE SKILL-GAP VISUALIZER WIDGET (Tritanopia-Safe)   */}
          {/* ========================================================= */}
          <div className="bg-[#F7F8FC] dark:bg-[#010409] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-5 sm:p-6 mb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff7b72]" />
                <h3 className="font-bold text-base text-[#111827] dark:text-[#f0f6fc]">Skill-Gap Detection Matrix</h3>
              </div>
              <span className="font-sans text-xs text-[#cf222e] dark:text-[#ff7b72] bg-[#ffebe9] dark:bg-[rgba(248,81,73,0.15)] border border-[#ff8182]/30 dark:border-[rgba(248,81,73,0.45)] px-3 py-0.5 rounded-full font-semibold">
                {activeOpenRoles.length > 0 ? `${activeOpenRoles.length} Open Gaps Identified` : 'Full Team Assembled'}
              </span>
            </div>

            <p className="text-xs text-[#6B7280] dark:text-[#9198a1] mb-5 leading-relaxed">
              DevSnapz analyzes the technical specification to map existing team proficiencies against required build competencies.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column: Team Has (Cyan/Sky-Blue for Tritanopia High Contrast) */}
              <div className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-xl p-4 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-sans text-[#0969da] dark:text-[#79c0ff] mb-2.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#0969da] dark:bg-[#79c0ff]" />
                  <span>Team Known Competencies ({knownSkills.length > 0 ? knownSkills.length : project.techStack.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(knownSkills.length > 0 ? knownSkills : project.techStack).map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-mono bg-[#ddf4ff] dark:bg-[rgba(56,139,253,0.15)] text-[#0969da] dark:text-[#79c0ff] border border-[#54aeff]/30 dark:border-[rgba(56,139,253,0.4)] px-2.5 py-1 rounded-lg font-medium"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Missing Skill Gaps (High-Contrast Coral/Red for Tritanopia Safe Separation) */}
              <div className="bg-white dark:bg-[#151b23] border border-[#ff8182]/30 dark:border-[rgba(248,81,73,0.45)] rounded-xl p-4 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-sans text-[#cf222e] dark:text-[#ff7b72] mb-2.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#cf222e] dark:bg-[#ff7b72]" />
                  <span>Identified Skill Gaps ({allGapSkills.length})</span>
                </div>
                {allGapSkills.length === 0 ? (
                  <p className="text-xs text-[#6B7280] dark:text-[#9198a1]">No active skill gaps flagged for this build.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {allGapSkills.map((gap) => (
                      <span
                        key={gap}
                        className="text-xs font-mono bg-[#ffebe9] dark:bg-[rgba(248,81,73,0.15)] text-[#cf222e] dark:text-[#ff7b72] border border-[#ff8182]/30 dark:border-[rgba(248,81,73,0.45)] px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold"
                      >
                        ⚡ Need: {gap}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Main Content & Interactive Tabs (65% / 35% Two-Column Desktop Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Tab Content (lg:col-span-8, approx 65% width) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Tab Selector Buttons */}
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] dark:border-[#3d444d] pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('collaborate')}
              className={tabButtonClass('collaborate')}
            >
              Open Roles ({activeOpenRoles.length})
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={tabButtonClass('guide')}
            >
              Mentorship & Q&A ({project.guidanceTopics?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('contribute')}
              className={tabButtonClass('contribute')}
            >
              Tasks & Issues ({project.contributeIssues?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('sponsor')}
              className={tabButtonClass('sponsor')}
            >
              Milestones & Support
            </button>
          </div>

          {/* TAB 1: COLLABORATE & OPEN ROLES */}
          {activeTab === 'collaborate' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xl text-[#111827] dark:text-[#f0f6fc]">Open Collaboration Roles</h3>
                <span className="text-xs font-sans text-[#6B7280] dark:text-[#9198a1]">One-click application</span>
              </div>

              {openRolesList.length === 0 ? (
                <div className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-8 text-center text-sm text-[#6B7280] dark:text-[#9198a1] shadow-xs">
                  No open roles currently defined for this build.
                </div>
              ) : (
                openRolesList.map((role) => (
                  <div
                    key={role.id}
                    className={`bg-white dark:bg-[#151b23] border rounded-2xl p-5 sm:p-6 transition-all shadow-xs ${
                      role.status === 'open'
                        ? 'border-[#E5E7EB] dark:border-[#3d444d] hover:border-[#1f6feb]/50'
                        : 'border-[#E5E7EB]/60 dark:border-[#3d444d]/60 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <h4 className="font-bold text-lg text-[#111827] dark:text-[#f0f6fc]">{role.roleName}</h4>
                          <span
                            className={`text-[0.65rem] font-sans uppercase font-bold px-2.5 py-0.5 rounded-full ${
                              role.status === 'open'
                                ? 'bg-[#ddf4ff] dark:bg-[rgba(56,139,253,0.15)] text-[#0969da] dark:text-[#79c0ff] border border-[#54aeff]/30 dark:border-[rgba(56,139,253,0.4)]'
                                : 'bg-[#F7F8FC] dark:bg-[#010409] text-[#6B7280] dark:text-[#9198a1] border border-[#E5E7EB] dark:border-[#3d444d]'
                            }`}
                          >
                            {role.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B7280] dark:text-[#9198a1] leading-relaxed max-w-xl">{role.description}</p>
                        
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {role.skillsNeeded.map((skill) => (
                            <span
                              key={skill}
                              className="text-xs font-mono bg-[#ddf4ff] dark:bg-[rgba(56,139,253,0.15)] text-[#0969da] dark:text-[#79c0ff] border border-[#54aeff]/30 dark:border-[rgba(56,139,253,0.3)] px-2 py-0.5 rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {role.status === 'open' && (
                        <button
                          onClick={() => {
                            setSelectedRole(role);
                            setApplicantSkills(role.skillsNeeded.join(', '));
                          }}
                          className="font-sans text-xs bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold px-4 py-2 rounded-xl shadow-xs transition-all whitespace-nowrap self-start"
                        >
                          Apply to Role ➔
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Embedded Application Drawer */}
              {selectedRole && (
                <div className="bg-white dark:bg-[#151b23] border-2 border-[#1f6feb] rounded-2xl p-6 sm:p-8 shadow-sm animate-fade-in mt-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] dark:border-[#3d444d] mb-5">
                    <div>
                      <h4 className="font-extrabold text-lg text-[#111827] dark:text-[#f0f6fc]">
                        Apply for {selectedRole.roleName}
                      </h4>
                      <p className="text-xs text-[#6B7280] dark:text-[#9198a1] mt-0.5">Pitch your skills directly to {project.creatorName}</p>
                    </div>
                    <button
                      onClick={() => setSelectedRole(null)}
                      className="text-[#9CA3AF] dark:text-[#656c76] hover:text-[#111827] dark:hover:text-[#f0f6fc] text-2xl font-bold w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F7F8FC] dark:hover:bg-[#010409]"
                    >
                      ×
                    </button>
                  </div>

                  {applicationSuccess ? (
                    <div className="bg-[#ddf4ff] dark:bg-[rgba(56,139,253,0.15)] border border-[#54aeff]/30 dark:border-[rgba(56,139,253,0.4)] rounded-xl p-6 text-center text-[#0969da] dark:text-[#79c0ff]">
                      <div className="text-2xl mb-2">🎉</div>
                      <div className="font-bold text-base">Application Submitted!</div>
                      <p className="text-xs text-[#4B5563] dark:text-[#9198a1] mt-1">The creator has been notified in their Creator Hub.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleApplicationSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-[#6B7280] dark:text-[#9198a1] uppercase mb-1 font-semibold">Your Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Maya Patel"
                            value={applicantName}
                            onChange={(e) => setApplicantName(e.target.value)}
                            className="w-full bg-[#F7F8FC] dark:bg-[#010409] border border-[#E5E7EB] dark:border-[#3d444d] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] dark:text-[#f0f6fc] outline-none focus:border-[#1f6feb] focus:ring-2 focus:ring-[#1f6feb]/20 placeholder-[#9CA3AF] dark:placeholder-[#656c76]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-[#6B7280] dark:text-[#9198a1] uppercase mb-1 font-semibold">Student Email or Discord</label>
                          <input
                            type="text"
                            required
                            placeholder="maya@student.edu or @maya#0001"
                            value={applicantEmail}
                            onChange={(e) => setApplicantEmail(e.target.value)}
                            className="w-full bg-[#F7F8FC] dark:bg-[#010409] border border-[#E5E7EB] dark:border-[#3d444d] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] dark:text-[#f0f6fc] outline-none focus:border-[#1f6feb] focus:ring-2 focus:ring-[#1f6feb]/20 placeholder-[#9CA3AF] dark:placeholder-[#656c76]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-[#6B7280] dark:text-[#9198a1] uppercase mb-1 font-semibold">Your Relevant Skills & Experience</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 2 years React, built campus event app with Tailwind"
                          value={applicantSkills}
                          onChange={(e) => setApplicantSkills(e.target.value)}
                          className="w-full bg-[#F7F8FC] dark:bg-[#010409] border border-[#E5E7EB] dark:border-[#3d444d] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] dark:text-[#f0f6fc] outline-none focus:border-[#1f6feb] focus:ring-2 focus:ring-[#1f6feb]/20 placeholder-[#9CA3AF] dark:placeholder-[#656c76]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-[#6B7280] dark:text-[#9198a1] uppercase mb-1 font-semibold">Introduction Pitch / Message</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Why do you want to collaborate on this project? What can you build?"
                          value={applicantMessage}
                          onChange={(e) => setApplicantMessage(e.target.value)}
                          className="w-full bg-[#F7F8FC] dark:bg-[#010409] border border-[#E5E7EB] dark:border-[#3d444d] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] dark:text-[#f0f6fc] outline-none focus:border-[#1f6feb] focus:ring-2 focus:ring-[#1f6feb]/20 placeholder-[#9CA3AF] dark:placeholder-[#656c76] resize-none"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRole(null)}
                          className="px-4 py-2 border border-[#E5E7EB] dark:border-[#3d444d] rounded-xl text-xs font-sans text-[#6B7280] dark:text-[#9198a1] hover:text-[#111827] dark:hover:text-[#f0f6fc] hover:bg-[#F7F8FC] dark:hover:bg-[#010409]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold px-6 py-2.5 rounded-xl text-xs font-sans shadow-xs transition-all"
                        >
                          Send Collaboration Request ➔
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GUIDANCE & MENTORSHIP */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xl text-[#111827] dark:text-[#f0f6fc]">Technical Guidance & Mentorship</h3>
                <span className="text-xs font-sans text-[#6B7280] dark:text-[#9198a1]">Peer architecture advice</span>
              </div>

              {/* Ask Question Form */}
              <form onSubmit={handleAddQuestionSubmit} className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-4 flex gap-3 shadow-xs">
                <input
                  type="text"
                  placeholder="Ask a technical question about this architecture..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="flex-grow bg-[#F7F8FC] dark:bg-[#010409] border border-[#E5E7EB] dark:border-[#3d444d] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] dark:text-[#f0f6fc] outline-none focus:border-[#1f6feb] focus:ring-2 focus:ring-[#1f6feb]/20 placeholder-[#9CA3AF] dark:placeholder-[#656c76]"
                />
                <button
                  type="submit"
                  className="bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold px-4 py-2 rounded-xl text-xs font-sans shadow-xs whitespace-nowrap"
                >
                  Ask Question
                </button>
              </form>

              {/* Topics List */}
              <div className="space-y-4">
                {(project.guidanceTopics || []).length === 0 ? (
                  <div className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-8 text-center text-sm text-[#6B7280] dark:text-[#9198a1] shadow-xs">
                    No guidance questions asked yet. Be the first to ask!
                  </div>
                ) : (
                  (project.guidanceTopics || []).map((topic) => (
                    <div key={topic.id} className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-bold text-sm text-[#111827] dark:text-[#f0f6fc]">{topic.question}</h4>
                        <span className="text-[0.68rem] font-mono text-[#9CA3AF] dark:text-[#656c76] whitespace-nowrap">
                          {new Date(topic.askedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-[0.72rem] font-mono text-[#6B7280] dark:text-[#9198a1]">Asked by @{topic.askedBy.toLowerCase()}</div>

                      {/* Replies */}
                      <div className="space-y-2.5 pt-2 pl-3 border-l-2 border-[#1f6feb]/40">
                        {topic.replies.map((reply) => (
                          <div key={reply.id} className="bg-[#F7F8FC] dark:bg-[#010409] border border-[#E5E7EB] dark:border-[#3d444d] p-3.5 rounded-xl text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-semibold text-[#1f6feb] dark:text-[#58a6ff] flex items-center gap-1.5">
                                @{reply.repliedBy.toLowerCase()}
                                {reply.isCreator && (
                                  <span className="text-[0.62rem] bg-[#ddf4ff] dark:bg-[rgba(56,139,253,0.15)] border border-[#54aeff]/30 dark:border-[rgba(56,139,253,0.3)] px-1.5 py-0.2 rounded text-[#0969da] dark:text-[#79c0ff] font-sans font-semibold">
                                    Project Lead
                                  </span>
                                )}
                              </span>
                              <span className="text-[0.68rem] text-[#9CA3AF] dark:text-[#656c76]">
                                {new Date(reply.repliedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-[#4B5563] dark:text-[#9198a1] leading-relaxed">{reply.replyText}</p>
                          </div>
                        ))}

                        {/* Inline Reply Input */}
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Provide advice or guidance..."
                            value={replyInput[topic.id] || ''}
                            onChange={(e) =>
                              setReplyInput((prev) => ({ ...prev, [topic.id]: e.target.value }))
                            }
                            className="flex-grow bg-[#F7F8FC] dark:bg-[#010409] border border-[#E5E7EB] dark:border-[#3d444d] rounded-xl px-3 py-1.5 text-xs text-[#111827] dark:text-[#f0f6fc] outline-none focus:border-[#1f6feb] placeholder-[#9CA3AF] dark:placeholder-[#656c76]"
                          />
                          <button
                            type="button"
                            onClick={() => handleReplySubmit(topic.id)}
                            className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] hover:border-[#1f6feb] text-xs font-sans text-[#111827] dark:text-[#f0f6fc] px-3.5 py-1.5 rounded-xl transition-colors font-medium shadow-xs"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CONTRIBUTE ISSUES */}
          {activeTab === 'contribute' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xl text-[#111827] dark:text-[#f0f6fc]">Claimable Tasks & Issues</h3>
                <span className="text-xs font-sans text-[#6B7280] dark:text-[#9198a1]">Starter engineering tasks</span>
              </div>

              {(project.contributeIssues || []).length === 0 ? (
                <div className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-8 text-center text-sm text-[#6B7280] dark:text-[#9198a1] shadow-xs">
                  No issues registered yet for this project.
                </div>
              ) : (
                (project.contributeIssues || []).map((issue) => (
                  <div
                    key={issue.id}
                    className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[0.65rem] font-sans uppercase font-bold px-2 py-0.5 rounded-full border ${
                            issue.difficulty === 'easy'
                              ? 'bg-[#ddf4ff] dark:bg-[rgba(56,139,253,0.15)] text-[#0969da] dark:text-[#79c0ff] border-[#54aeff]/30 dark:border-[rgba(56,139,253,0.4)]'
                              : issue.difficulty === 'medium'
                              ? 'bg-[#ffebe9] dark:bg-[rgba(248,81,73,0.15)] text-[#cf222e] dark:text-[#ff7b72] border-[#ff8182]/30 dark:border-[rgba(248,81,73,0.4)]'
                              : 'bg-[#ffebe9] dark:bg-[rgba(248,81,73,0.25)] text-[#cf222e] dark:text-[#ff7b72] border-[#cf222e]/40'
                          }`}
                        >
                          {issue.difficulty}
                        </span>
                        <span className="font-semibold text-sm text-[#111827] dark:text-[#f0f6fc]">{issue.title}</span>
                      </div>
                      <a
                        href={issue.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.72rem] font-mono text-[#1f6feb] dark:text-[#58a6ff] hover:underline mt-1 inline-block"
                      >
                        View on GitHub ↗
                      </a>
                    </div>

                    <div>
                      {issue.status === 'open' && (
                        <button
                          onClick={() => onClaimIssue(project.id, issue.id)}
                          className="bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-sans text-xs font-semibold px-3.5 py-1.5 rounded-xl shadow-xs transition-all"
                        >
                          Claim Issue
                        </button>
                      )}
                      {issue.status === 'claimed' && (
                        <span className="text-xs font-sans font-semibold text-[#cf222e] dark:text-[#ff7b72] bg-[#ffebe9] dark:bg-[rgba(248,81,73,0.15)] border border-[#ff8182]/30 dark:border-[rgba(248,81,73,0.4)] px-2.5 py-1 rounded-lg">
                          Claimed
                        </span>
                      )}
                      {issue.status === 'merged' && (
                        <span className="text-xs font-sans font-semibold text-[#0969da] dark:text-[#79c0ff] bg-[#ddf4ff] dark:bg-[rgba(56,139,253,0.15)] border border-[#54aeff]/30 dark:border-[rgba(56,139,253,0.4)] px-2.5 py-1 rounded-lg">
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: SPONSOR & MILESTONES */}
          {activeTab === 'sponsor' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xl text-[#111827] dark:text-[#f0f6fc]">Milestone Sponsorship</h3>
                <span className="text-xs font-sans text-[#6B7280] dark:text-[#9198a1]">Support student infrastructure</span>
              </div>

              {/* Funding Progress Bar */}
              {project.fundingGoal && (
                <div className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-[#6B7280] dark:text-[#9198a1]">
                      Raised: <strong className="text-[#111827] dark:text-[#f0f6fc] font-bold">${project.fundingRaised || 0}</strong>
                    </span>
                    <span className="text-[#9CA3AF] dark:text-[#656c76]">Goal: ${project.fundingGoal}</span>
                  </div>
                  <div className="w-full bg-[#F7F8FC] dark:bg-[#010409] rounded-full h-2.5 overflow-hidden border border-[#E5E7EB] dark:border-[#3d444d]">
                    <div
                      className="bg-[#1f6feb] h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${Math.min(100, (((project.fundingRaised || 0) / project.fundingGoal) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Sponsorship Tiers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(project.sponsorshipTiers || []).map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTier(tier)}
                    className={`bg-white dark:bg-[#151b23] border rounded-2xl p-4 cursor-pointer transition-all shadow-xs ${
                      selectedTier?.id === tier.id
                        ? 'border-[#1f6feb] bg-[#ddf4ff]/40 dark:bg-[rgba(56,139,253,0.15)] ring-1 ring-[#1f6feb]'
                        : 'border-[#E5E7EB] dark:border-[#3d444d] hover:border-[#1f6feb]/50'
                    }`}
                  >
                    <div className="font-bold text-sm text-[#111827] dark:text-[#f0f6fc]">{tier.name}</div>
                    <div className="text-xl font-extrabold text-[#1f6feb] dark:text-[#58a6ff] mt-1">${tier.amount}</div>
                    <p className="text-xs text-[#6B7280] dark:text-[#9198a1] mt-2 leading-relaxed">{tier.benefits}</p>
                  </div>
                ))}
              </div>

              {/* Sponsor Form */}
              <form onSubmit={handleSponsorSubmit} className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-6 space-y-4 shadow-xs">
                <h4 className="font-bold text-sm text-[#111827] dark:text-[#f0f6fc]">Back this Student Project</h4>
                {sponsorSuccess ? (
                  <div className="text-center text-xs text-[#0969da] dark:text-[#79c0ff] bg-[#ddf4ff] dark:bg-[rgba(56,139,253,0.15)] border border-[#54aeff]/30 dark:border-[rgba(56,139,253,0.4)] py-3 rounded-xl font-semibold">
                    Thank you! Your sponsorship has been recorded.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-[#6B7280] dark:text-[#9198a1] uppercase mb-1 font-semibold">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alex Chen"
                          value={sponsorName}
                          onChange={(e) => setSponsorName(e.target.value)}
                          className="w-full bg-[#F7F8FC] dark:bg-[#010409] border border-[#E5E7EB] dark:border-[#3d444d] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] dark:text-[#f0f6fc] outline-none focus:border-[#1f6feb] placeholder-[#9CA3AF] dark:placeholder-[#656c76]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-[#6B7280] dark:text-[#9198a1] uppercase mb-1 font-semibold">Amount ($ USD)</label>
                        <input
                          type="number"
                          required
                          placeholder="10"
                          value={selectedTier ? selectedTier.amount : customAmount}
                          onChange={(e) => {
                            setSelectedTier(null);
                            setCustomAmount(e.target.value);
                          }}
                          className="w-full bg-[#F7F8FC] dark:bg-[#010409] border border-[#E5E7EB] dark:border-[#3d444d] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] dark:text-[#f0f6fc] outline-none focus:border-[#1f6feb] placeholder-[#9CA3AF] dark:placeholder-[#656c76]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#6B7280] dark:text-[#9198a1] uppercase mb-1 font-semibold">Encouraging Note</label>
                      <input
                        type="text"
                        placeholder="Keep shipping!"
                        value={sponsorMessage}
                        onChange={(e) => setSponsorMessage(e.target.value)}
                        className="w-full bg-[#F7F8FC] dark:bg-[#010409] border border-[#E5E7EB] dark:border-[#3d444d] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] dark:text-[#f0f6fc] outline-none focus:border-[#1f6feb] placeholder-[#9CA3AF] dark:placeholder-[#656c76]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold px-6 py-2.5 rounded-xl text-xs font-sans shadow-xs transition-all"
                    >
                      Confirm Sponsorship ➔
                    </button>
                  </>
                )}
              </form>
            </div>
          )}

        </div>

        {/* Right Column: Project Sidebar (lg:col-span-4, approx 35% width) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Metrics */}
          <div className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
            <h3 className="font-mono text-xs uppercase text-[#9CA3AF] dark:text-[#656c76] tracking-wider font-semibold">
              Project Summary
            </h3>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-[#F7F8FC] dark:bg-[#010409] rounded-xl border border-[#E5E7EB] dark:border-[#3d444d]">
                <div className="text-xl font-extrabold text-[#111827] dark:text-[#f0f6fc]">{activeOpenRoles.length}</div>
                <div className="text-[0.68rem] font-mono text-[#6B7280] dark:text-[#9198a1] uppercase">Open Roles</div>
              </div>
              <div className="p-3.5 bg-[#F7F8FC] dark:bg-[#010409] rounded-xl border border-[#E5E7EB] dark:border-[#3d444d]">
                <div className="text-xl font-extrabold text-[#cf222e] dark:text-[#ff7b72]">{allGapSkills.length}</div>
                <div className="text-[0.68rem] font-mono text-[#6B7280] dark:text-[#9198a1] uppercase">Skill Gaps</div>
              </div>
              <div className="p-3.5 bg-[#F7F8FC] dark:bg-[#010409] rounded-xl border border-[#E5E7EB] dark:border-[#3d444d]">
                <div className="text-xl font-extrabold text-[#111827] dark:text-[#f0f6fc]">{project.guidanceTopics?.length || 0}</div>
                <div className="text-[0.68rem] font-mono text-[#6B7280] dark:text-[#9198a1] uppercase">Discussions</div>
              </div>
              <div className="p-3.5 bg-[#F7F8FC] dark:bg-[#010409] rounded-xl border border-[#E5E7EB] dark:border-[#3d444d]">
                <div className="text-xl font-extrabold text-[#111827] dark:text-[#f0f6fc]">{project.contributeIssues?.length || 0}</div>
                <div className="text-[0.68rem] font-mono text-[#6B7280] dark:text-[#9198a1] uppercase">Open Tasks</div>
              </div>
            </div>
          </div>

          {/* External Links */}
          <div className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
            <h3 className="font-mono text-xs uppercase text-[#9CA3AF] dark:text-[#656c76] tracking-wider font-semibold">
              Project Links
            </h3>
            <div className="space-y-2 pt-1">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F7F8FC] dark:bg-[#010409] hover:bg-[#ddf4ff]/40 dark:hover:bg-[rgba(56,139,253,0.1)] text-[#111827] dark:text-[#f0f6fc] hover:text-[#1f6feb] dark:hover:text-[#58a6ff] border border-[#E5E7EB] dark:border-[#3d444d] text-xs font-sans font-semibold transition-all"
                >
                  <span className="flex items-center gap-2">
                    <span>🐙</span>
                    <span>GitHub Repository</span>
                  </span>
                  <span>↗</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F7F8FC] dark:bg-[#010409] hover:bg-[#ddf4ff]/40 dark:hover:bg-[rgba(56,139,253,0.1)] text-[#111827] dark:text-[#f0f6fc] hover:text-[#1f6feb] dark:hover:text-[#58a6ff] border border-[#E5E7EB] dark:border-[#3d444d] text-xs font-sans font-semibold transition-all"
                >
                  <span className="flex items-center gap-2">
                    <span>🌐</span>
                    <span>Live Deployment</span>
                  </span>
                  <span>↗</span>
                </a>
              )}
            </div>
          </div>

          {/* Full Tech Stack Tags */}
          <div className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
            <h3 className="font-mono text-xs uppercase text-[#9CA3AF] dark:text-[#656c76] tracking-wider font-semibold">
              Full Technical Stack
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs bg-[#F7F8FC] dark:bg-[#010409] text-[#4B5563] dark:text-[#9198a1] border border-[#E5E7EB] dark:border-[#3d444d] px-2.5 py-1 rounded-lg"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Call to Action for Student Creators */}
          <div className="bg-[#ddf4ff]/40 dark:bg-[#151b23] border border-[#1f6feb]/30 dark:border-[#3d444d] rounded-2xl p-6 text-center shadow-xs">
            <h4 className="font-bold text-sm text-[#111827] dark:text-[#f0f6fc]">Building your own idea?</h4>
            <p className="text-xs text-[#4B5563] dark:text-[#9198a1] mt-1.5 mb-4 leading-relaxed">
              Publish your project on DevSnapz to analyze missing skills and recruit student collaborators.
            </p>
            <Link
              to="/profile"
              className="bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-sans text-xs font-semibold px-4 py-2.5 rounded-xl inline-block shadow-xs transition-all"
            >
              Go to Your Profile ➔
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
