import React, { useState } from 'react';
import { Project, OpenRole, SponsorshipTier } from '../types';
import { CheckIcon } from './Octicons';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
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

type ActiveTab = 'overview' | 'collaborate' | 'sponsor' | 'guide' | 'contribute';

export default function ProjectDetailModal({
  project,
  onClose,
  onApplyToCollaborate,
  onSponsorProject,
  onAddGuidanceTopic,
  onReplyToGuidance,
  onClaimIssue,
}: ProjectDetailModalProps) {
  // Determine the default active tab based on what's available
  const getInitialTab = (): ActiveTab => {
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<ActiveTab>(getInitialTab());
  
  // Collaboration Form State
  const [selectedRole, setSelectedRole] = useState<OpenRole | null>(null);
  const [collabForm, setCollabForm] = useState({
    name: '',
    email: '',
    skills: '',
    message: '',
  });
  const [collabSuccess, setCollabSuccess] = useState(false);

  // Sponsorship Form State
  const [selectedTier, setSelectedTier] = useState<SponsorshipTier | null>(null);
  const [customSponsorAmount, setCustomSponsorAmount] = useState('');
  const [sponsorForm, setSponsorForm] = useState({
    name: '',
    message: '',
    cardNumber: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvc: '123',
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [sponsorSuccess, setSponsorSuccess] = useState(false);

  // Guidance Board State
  const [newQuestion, setNewQuestion] = useState('');
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Handle Application Submit
  const handleCollabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    onApplyToCollaborate({
      projectId: project.id,
      roleName: selectedRole.roleName,
      applicantName: collabForm.name,
      applicantEmail: collabForm.email,
      skills: collabForm.skills,
      message: collabForm.message,
    });
    setCollabSuccess(true);
    setTimeout(() => {
      setCollabSuccess(false);
      setSelectedRole(null);
      setCollabForm({ name: '', email: '', skills: '', message: '' });
    }, 2500);
  };

  // Handle Sponsor Submit
  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = selectedTier ? selectedTier.amount : parseFloat(customSponsorAmount);
    if (isNaN(amount) || amount <= 0) return;

    onSponsorProject({
      projectId: project.id,
      amount,
      sponsorName: sponsorForm.name || 'Anonymous Sponsor',
      message: sponsorForm.message,
    });
    setSponsorSuccess(true);
    setTimeout(() => {
      setSponsorSuccess(false);
      setShowCheckout(false);
      setSelectedTier(null);
      setCustomSponsorAmount('');
      setSponsorForm({ name: '', message: '', cardNumber: '4242 •••• •••• 4242', expiry: '12/28', cvc: '123' });
    }, 2500);
  };

  // Handle Guidance Question Submit
  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    onAddGuidanceTopic(project.id, newQuestion);
    setNewQuestion('');
  };

  // Handle Reply Submit
  const handleReplySubmit = (e: React.FormEvent, topicId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReplyToGuidance(project.id, topicId, replyText);
    setReplyText('');
  };

  // Total funds percentage progress
  const fundingPercent = project.fundingGoal
    ? Math.min(100, Math.round(((project.fundingRaised || 0) / project.fundingGoal) * 100))
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/70 backdrop-blur-md transition-all duration-300">
      <div className="relative w-full max-w-4xl bg-bg1 border border-ink3 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Banner with Close Button */}
        <div className={`h-40 bg-gradient-to-r ${project.bannerGradient} relative flex items-end p-6`}>
          <div className="absolute inset-0 bg-black/45" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-bg0/60 hover:bg-bg0/80 text-ink0 border border-ink3/50 hover:border-ink2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="relative z-10">
            <span className="text-[0.65rem] font-dmmono uppercase px-2 py-0.5 rounded bg-bg0/40 text-g border border-g-dim">
              @{project.creatorName.split(' ')[0].toLowerCase()}
            </span>
            <h1 className="font-outfit font-extrabold text-2xl sm:text-3xl text-white mt-1.5 leading-tight">
              {project.title}
            </h1>
            <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-2xl font-light line-clamp-1">
              {project.pitch}
            </p>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="border-b border-ink3 bg-bg0 px-4 sm:px-6 flex overflow-x-auto scrollbar-none gap-2">
          {(['overview', 'collaborate', 'sponsor', 'guide', 'contribute'] as const).map((tab) => {
            // Check if tab is enabled by configuration
            if (tab === 'collaborate' && !project.helpNeeded.collaborate) return null;
            if (tab === 'sponsor' && !project.helpNeeded.sponsor) return null;
            if (tab === 'guide' && !project.helpNeeded.guide) return null;
            if (tab === 'contribute' && !project.helpNeeded.contribute) return null;

            const labels: Record<ActiveTab, string> = {
              overview: 'Overview',
              collaborate: 'Collaborate',
              sponsor: 'Sponsor',
              guide: 'Guidance Board',
              contribute: 'Contribute',
            };

            const icons: Record<ActiveTab, React.ReactNode> = {
              overview: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              collaborate: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ),
              sponsor: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              guide: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ),
              contribute: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              ),
            };

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-4 text-xs font-semibold font-dmmono border-b-2 flex items-center gap-2 transition-all outline-none whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-g text-g'
                    : 'border-transparent text-ink1 hover:text-ink0'
                }`}
              >
                {icons[tab]}
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 overflow-y-auto max-h-[50vh] min-h-[350px]">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Description & creator details */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-ink2 uppercase tracking-wider mb-2 font-dmmono">About the Project</h3>
                  <p className="text-sm text-ink0 leading-relaxed whitespace-pre-wrap">{project.description}</p>
                </div>
                
                <div className="flex items-center gap-4 bg-bg2 p-4 rounded-xl border border-ink3">
                  <img src={project.creatorAvatar} alt={project.creatorName} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="text-xs text-ink1">Created by</div>
                    <div className="font-outfit font-bold text-sm text-ink0">{project.creatorName}</div>
                    <div className="flex gap-2.5 mt-1">
                      {project.creatorGithub && (
                        <a
                          href={`https://github.com/${project.creatorGithub}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[0.68rem] text-g-text hover:underline flex items-center gap-0.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                          Github
                        </a>
                      )}
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.68rem] text-ink1 hover:underline hover:text-ink0"
                      >
                        Codebase ➔
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Sidebar stats */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-ink2 uppercase tracking-wider mb-2 font-dmmono">Tech Stack</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-dmmono bg-bg2 border border-ink3 px-2.5 py-1 rounded-md text-ink0"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-ink2 uppercase tracking-wider mb-2 font-dmmono">Links</h3>
                  <div className="space-y-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between text-xs text-ink0 bg-bg2 border border-ink3 rounded-lg p-2.5 hover:border-ink2 hover:bg-bg3 transition-all"
                    >
                      <span className="font-semibold flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-ink1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        GitHub Repository
                      </span>
                      <span className="text-ink1">➔</span>
                    </a>
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-xs text-ink0 bg-bg2 border border-ink3 rounded-lg p-2.5 hover:border-g/40 hover:bg-bg3 transition-all"
                      >
                        <span className="font-semibold text-g-text flex items-center gap-1.5">
                          <svg className="w-4 h-4 stroke-g" fill="none" viewBox="0 0 24 24" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                          Live Demonstration
                        </span>
                        <span className="text-g">➔</span>
                      </a>
                    ) : (
                      <div className="text-xs text-ink2 bg-bg2 border border-ink3/50 rounded-lg p-2.5 italic">
                        No live demo currently active
                      </div>
                    )}
                  </div>
                </div>

                {project.helpNeeded.sponsor && project.fundingGoal && (
                  <div>
                    <h3 className="text-sm font-semibold text-ink2 uppercase tracking-wider mb-2 font-dmmono">Sponsorship Goal</h3>
                    <div className="bg-bg2 border border-ink3 rounded-xl p-4">
                      <div className="flex justify-between items-center text-xs text-ink1 mb-1.5">
                        <span>Funded: <strong>${project.fundingRaised}</strong></span>
                        <span>Goal: <strong>${project.fundingGoal}</strong></span>
                      </div>
                      <div className="w-full bg-bg3 h-2 rounded-full overflow-hidden border border-ink3">
                        <div className="bg-g h-full rounded-full" style={{ width: `${fundingPercent}%` }} />
                      </div>
                      <div className="text-center mt-2.5">
                        <span className="text-[0.65rem] font-dmmono text-ink1">
                          {fundingPercent}% towards funding next dev milestones
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: COLLABORATE */}
          {activeTab === 'collaborate' && (
            <div className="space-y-6">
              {!selectedRole ? (
                <>
                  <div className="flex justify-between items-center border-b border-ink3 pb-3">
                    <h3 className="text-base font-outfit font-bold text-ink0">Open Collaboration Roles</h3>
                    <span className="bg-blue-500/10 text-blue-400 text-xs px-2.5 py-1 border border-blue-500/20 rounded font-semibold">
                      {project.openRoles?.filter((r) => r.status === 'open').length} Available
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {project.openRoles && project.openRoles.length > 0 ? (
                      project.openRoles.map((role) => (
                        <div
                          key={role.id}
                          className="bg-bg2 border border-ink3 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-blue-500/30 transition-all duration-200"
                        >
                          <div className="max-w-xl">
                            <h4 className="font-outfit font-bold text-sm text-ink0 flex items-center gap-2">
                              {role.roleName}
                              {role.status === 'filled' && (
                                <span className="text-[0.6rem] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-ink3/45 text-ink1 border border-ink3">
                                  Filled
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-ink1 mt-1 leading-relaxed">{role.description}</p>
                            <div className="flex flex-wrap gap-1 mt-3">
                              {role.skillsNeeded.map((skill) => (
                                <span
                                  key={skill}
                                  className="text-[0.62rem] font-dmmono bg-bg3 border border-ink3 px-2 py-0.5 rounded text-ink1"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {role.status === 'open' && (
                            <button
                              onClick={() => setSelectedRole(role)}
                              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4.5 py-2.5 rounded-lg whitespace-nowrap active:scale-95 transition-all shadow-[0_0_12px_rgba(59,130,246,0.2)]"
                            >
                              Apply to Join
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-ink2 italic text-sm">
                        No specific roles posted, but they are open to collaboration suggestions.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Collaborative Role Application form */
                <div className="max-w-xl mx-auto bg-bg2 border border-ink3 rounded-xl p-6 relative">
                  <button
                    onClick={() => setSelectedRole(null)}
                    className="absolute top-4 right-4 text-xs font-dmmono text-ink1 hover:text-ink0"
                  >
                    ← Back to roles
                  </button>

                  <h3 className="font-outfit font-bold text-base text-ink0 mb-1">
                    Apply for: {selectedRole.roleName}
                  </h3>
                  <p className="text-xs text-ink1 mb-5">
                    Your request will go directly to the project creator's hub for review.
                  </p>

                  {collabSuccess ? (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 text-center py-10 animate-pulse">
                      <svg className="w-10 h-10 stroke-blue-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h4 className="font-outfit font-bold text-blue-400 text-sm">Application Sent!</h4>
                      <p className="text-xs text-ink1 mt-2">
                        Thank you! {project.creatorName} will contact you via email if your skills match the goals.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleCollabSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-dmmono uppercase text-ink1 mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={collabForm.name}
                          onChange={(e) => setCollabForm({ ...collabForm, name: e.target.value })}
                          className="w-full bg-bg3 border border-ink3 rounded-lg px-3 py-2 text-xs text-ink0 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                          placeholder="Alice Cooper"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-dmmono uppercase text-ink1 mb-1">Your Email</label>
                        <input
                          type="email"
                          required
                          value={collabForm.email}
                          onChange={(e) => setCollabForm({ ...collabForm, email: e.target.value })}
                          className="w-full bg-bg3 border border-ink3 rounded-lg px-3 py-2 text-xs text-ink0 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                          placeholder="alice@gmail.com"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-dmmono uppercase text-ink1 mb-1">Key Skills & Experience</label>
                        <input
                          type="text"
                          required
                          value={collabForm.skills}
                          onChange={(e) => setCollabForm({ ...collabForm, skills: e.target.value })}
                          className="w-full bg-bg3 border border-ink3 rounded-lg px-3 py-2 text-xs text-ink0 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                          placeholder="React, Framer Motion, HTML, CSS, Figma (2 years)"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-dmmono uppercase text-ink1 mb-1">Why do you want to collaborate?</label>
                        <textarea
                          rows={3}
                          required
                          value={collabForm.message}
                          onChange={(e) => setCollabForm({ ...collabForm, message: e.target.value })}
                          className="w-full bg-bg3 border border-ink3 rounded-lg px-3 py-2 text-xs text-ink0 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                          placeholder="I am really excited about LLM autonomous flows. I built a canvas dragging UI last year..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 rounded-lg active:scale-95 transition-all shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                      >
                        Submit Application
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: SPONSOR */}
          {activeTab === 'sponsor' && (
            <div className="space-y-6">
              {!showCheckout ? (
                <>
                  <div className="border-b border-ink3 pb-3">
                    <h3 className="text-base font-outfit font-bold text-ink0">Support this Project</h3>
                    <p className="text-xs text-ink1 mt-1">
                      Choose a sponsorship level to support ongoing infrastructure, API costs, or development time.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {project.sponsorshipTiers && project.sponsorshipTiers.map((tier) => (
                      <div
                        key={tier.id}
                        className="bg-bg2 border border-ink3 rounded-xl p-5 hover:border-yellow-500/30 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="text-[0.62rem] font-dmmono uppercase text-yellow-400 font-semibold tracking-wider mb-1">
                            {tier.name}
                          </div>
                          <div className="text-2xl font-outfit font-extrabold text-ink0 mb-2">
                            ${tier.amount}
                            <span className="text-xs font-normal text-ink1">/mo</span>
                          </div>
                          <p className="text-xs text-ink1 leading-relaxed">{tier.benefits}</p>
                        </div>
                        
                        <button
                          onClick={() => {
                            setSelectedTier(tier);
                            setShowCheckout(true);
                          }}
                          className="w-full bg-yellow-500 hover:bg-yellow-400 text-bg0 font-semibold text-xs py-2 rounded-lg mt-5 active:scale-95 transition-all"
                        >
                          Select Tier
                        </button>
                      </div>
                    ))}

                    {/* Custom tier card */}
                    <div className="bg-bg2 border border-ink3 rounded-xl p-5 hover:border-yellow-500/30 transition-all flex flex-col justify-between">
                      <div>
                        <div className="text-[0.62rem] font-dmmono uppercase text-yellow-400 font-semibold tracking-wider mb-1">
                          Custom Sponsor
                        </div>
                        <div className="text-xs text-ink1 mb-3">Support with any custom amount.</div>
                        <div className="relative mt-2">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-semibold text-ink2">$</span>
                          <input
                            type="number"
                            placeholder="Amount"
                            value={customSponsorAmount}
                            onChange={(e) => setCustomSponsorAmount(e.target.value)}
                            className="w-full pl-7 pr-3 py-2 bg-bg3 border border-ink3 rounded-lg text-xs text-ink0 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30"
                          />
                        </div>
                      </div>
                      
                      <button
                        disabled={!customSponsorAmount || parseFloat(customSponsorAmount) <= 0}
                        onClick={() => {
                          setSelectedTier(null);
                          setShowCheckout(true);
                        }}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:hover:bg-yellow-500 text-bg0 font-semibold text-xs py-2 rounded-lg mt-5 active:scale-95 transition-all"
                      >
                        Sponsor Custom
                      </button>
                    </div>
                  </div>

                  {/* List of active sponsors */}
                  {project.sponsorsList && project.sponsorsList.length > 0 && (
                    <div className="pt-6 border-t border-ink3">
                      <h4 className="text-sm font-semibold text-ink2 uppercase tracking-wider mb-3 font-dmmono">Active Sponsors ({project.sponsorsList.length})</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {project.sponsorsList.map((sponsor, index) => (
                          <div key={index} className="bg-bg2 border border-ink3/60 rounded-xl p-3 flex items-start gap-3">
                            <img src={sponsor.avatar} alt={sponsor.name} className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <div className="flex justify-between items-baseline">
                                <span className="font-bold text-xs text-ink0">{sponsor.name}</span>
                                <span className="text-[0.62rem] font-semibold font-dmmono text-yellow-400 bg-yellow-950/20 px-1.5 py-0.5 rounded border border-yellow-500/20">
                                  ${sponsor.amount}
                                </span>
                              </div>
                              {sponsor.message && (
                                <p className="text-[0.7rem] text-ink1 italic mt-1 leading-relaxed">
                                  "{sponsor.message}"
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Checkout Form Modal */
                <div className="max-w-md mx-auto bg-bg2 border border-ink3 rounded-xl p-6 relative shadow-lg">
                  <button
                    onClick={() => {
                      setShowCheckout(false);
                      setSelectedTier(null);
                    }}
                    className="absolute top-4 right-4 text-xs font-dmmono text-ink1 hover:text-ink0"
                  >
                    ← Back to tiers
                  </button>

                  <h3 className="font-outfit font-bold text-base text-ink0 mb-1">
                    Secure Sponsorship
                  </h3>
                  <p className="text-xs text-ink1 mb-5">
                    Select checkout details. Funds are credited directly.
                  </p>

                  {sponsorSuccess ? (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 text-center py-10 animate-pulse">
                      <svg className="w-10 h-10 stroke-yellow-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h4 className="font-outfit font-bold text-yellow-400 text-sm">Sponsorship Verified!</h4>
                      <p className="text-xs text-ink1 mt-2">
                        Thank you for supporting this open-source effort. Your backer tier badge is now active!
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSponsorSubmit} className="space-y-4">
                      <div className="bg-bg3 border border-ink3 rounded-lg p-3 flex justify-between items-center text-xs">
                        <span className="text-ink1">Total Payment Amount:</span>
                        <span className="font-bold font-dmmono text-yellow-400">
                          ${selectedTier ? selectedTier.amount : customSponsorAmount}
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-dmmono uppercase text-ink1 mb-1">Your Name / Organization</label>
                        <input
                          type="text"
                          required
                          value={sponsorForm.name}
                          onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })}
                          className="w-full bg-bg3 border border-ink3 rounded-lg px-3 py-2 text-xs text-ink0 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30"
                          placeholder="GitHub Supporter"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-dmmono uppercase text-ink1 mb-1">Sponsor Message (Optional)</label>
                        <input
                          type="text"
                          value={sponsorForm.message}
                          onChange={(e) => setSponsorForm({ ...sponsorForm, message: e.target.value })}
                          className="w-full bg-bg3 border border-ink3 rounded-lg px-3 py-2 text-xs text-ink0 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30"
                          placeholder="Love the design, excited for version 2!"
                        />
                      </div>

                      {/* Mock Credit Card Fields */}
                      <div className="bg-bg0 border border-ink3 p-4 rounded-xl space-y-3">
                        <div className="text-[0.62rem] font-dmmono uppercase text-ink2">Simulated Sandbox Checkout</div>
                        <div>
                          <label className="block text-[0.6rem] font-dmmono uppercase text-ink1 mb-1">Card Number</label>
                          <input
                            type="text"
                            required
                            value={sponsorForm.cardNumber}
                            onChange={(e) => setSponsorForm({ ...sponsorForm, cardNumber: e.target.value })}
                            className="w-full bg-bg3 border border-ink3 rounded-lg px-3 py-1.5 text-xs text-ink0 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[0.6rem] font-dmmono uppercase text-ink1 mb-1">Expiry Date</label>
                            <input
                              type="text"
                              required
                              value={sponsorForm.expiry}
                              onChange={(e) => setSponsorForm({ ...sponsorForm, expiry: e.target.value })}
                              className="w-full bg-bg3 border border-ink3 rounded-lg px-3 py-1.5 text-xs text-ink0 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[0.6rem] font-dmmono uppercase text-ink1 mb-1">CVC Code</label>
                            <input
                              type="password"
                              required
                              value={sponsorForm.cvc}
                              onChange={(e) => setSponsorForm({ ...sponsorForm, cvc: e.target.value })}
                              className="w-full bg-bg3 border border-ink3 rounded-lg px-3 py-1.5 text-xs text-ink0 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-bg0 font-semibold text-xs py-2.5 rounded-lg active:scale-95 transition-all shadow-[0_0_12px_rgba(234,179,8,0.3)]"
                      >
                        Confirm Sandbox Sponsorship
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: GUIDE / MENTORING */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div className="border-b border-ink3 pb-3">
                <h3 className="text-base font-outfit font-bold text-ink0">Developer Guidance Board</h3>
                <p className="text-xs text-ink1 mt-1">
                  Ask technical questions, request architecture feedback, or answer queries from project creators.
                </p>
              </div>

              {/* Ask new question Form */}
              <form onSubmit={handleQuestionSubmit} className="bg-bg2 border border-ink3 rounded-xl p-4 flex gap-3">
                <input
                  type="text"
                  required
                  placeholder="Ask a technical or architectural question..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="flex-grow bg-bg3 border border-ink3 rounded-lg px-3 py-2 text-xs text-ink0 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-4 rounded-lg active:scale-95 transition-all"
                >
                  Ask Forum
                </button>
              </form>

              {/* Questions Threads List */}
              <div className="space-y-4">
                {project.guidanceTopics && project.guidanceTopics.length > 0 ? (
                  project.guidanceTopics.map((topic) => {
                    const isExpanded = activeTopicId === topic.id;
                    return (
                      <div
                        key={topic.id}
                        className="bg-bg2 border border-ink3 rounded-xl p-4 space-y-3 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[0.62rem] font-dmmono text-ink1">
                              Asked by @{topic.askedBy.toLowerCase()} · {new Date(topic.askedAt).toLocaleDateString()}
                            </span>
                            <h4 className="font-outfit font-bold text-xs text-ink0 mt-1 leading-normal">
                              {topic.question}
                            </h4>
                          </div>
                          
                          <button
                            onClick={() => setActiveTopicId(isExpanded ? null : topic.id)}
                            className="text-[0.65rem] font-dmmono text-purple-400 hover:text-purple-300"
                          >
                            {isExpanded ? 'Collapse thread' : `Replies (${topic.replies.length})`}
                          </button>
                        </div>

                        {/* Thread Replies */}
                        {isExpanded && (
                          <div className="pt-3 border-t border-ink3/40 space-y-3 pl-4 border-l-2 border-purple-500/30">
                            {topic.replies.map((reply) => (
                              <div key={reply.id} className="text-xs bg-bg3 border border-ink3/40 p-2.5 rounded-lg">
                                <div className="flex justify-between">
                                  <span className="font-bold text-ink0 flex items-center gap-1.5">
                                    @{reply.repliedBy.toLowerCase()}
                                    {reply.isCreator && (
                                      <span className="text-[0.52rem] font-semibold tracking-wider uppercase px-1.5 py-0.2 rounded bg-g/10 text-g border border-g-dim">
                                        Creator
                                      </span>
                                    )}
                                  </span>
                                  <span className="text-[0.6rem] text-ink2">
                                    {new Date(reply.repliedAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-ink1 mt-1 leading-relaxed whitespace-pre-wrap">{reply.replyText}</p>
                              </div>
                            ))}

                            {/* Reply Input Form */}
                            <form
                              onSubmit={(e) => handleReplySubmit(e, topic.id)}
                              className="flex gap-2 pt-2"
                            >
                              <input
                                type="text"
                                required
                                placeholder="Post a response to this topic..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="flex-grow bg-bg0 border border-ink3 rounded-lg px-3 py-1.5 text-xs text-ink0 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                              />
                              <button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-3 rounded-lg"
                              >
                                Reply
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-ink2 italic text-xs">
                    No questions have been asked yet. Be the first to initiate guidance discussions!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: CONTRIBUTE */}
          {activeTab === 'contribute' && (
            <div className="space-y-6">
              <div className="border-b border-ink3 pb-3">
                <h3 className="text-base font-outfit font-bold text-ink0">Open Contribution Guidelines</h3>
                <p className="text-xs text-ink1 mt-1">
                  Claim recommended issues or review git branches to help add code patches to the workspace.
                </p>
              </div>

              <div className="bg-bg2 border border-ink3 rounded-xl p-4 space-y-2.5">
                <h4 className="text-xs font-semibold uppercase text-ink2 font-dmmono">Quickstart Instructions</h4>
                <ol className="text-xs text-ink1 list-decimal pl-4 space-y-1">
                  <li>Clone the repository locally: <code className="font-dmmono bg-bg3 px-1 rounded text-ink0">git clone {project.githubUrl}</code></li>
                  <li>Check out the branch corresponding to the issue you choose.</li>
                  <li>Perform the changes, make sure local lint/tests compile, and push a Pull Request.</li>
                </ol>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase text-ink2 font-dmmono">Recommended Issues</h4>
                {project.contributeIssues && project.contributeIssues.length > 0 ? (
                  project.contributeIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="bg-bg2 border border-ink3 rounded-xl p-4 flex justify-between items-center hover:border-emerald-500/20"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[0.62rem] font-semibold font-dmmono uppercase px-1.5 py-0.5 rounded border ${
                            issue.difficulty === 'easy'
                              ? 'bg-green-500/10 text-green-400 border-green-500/20'
                              : issue.difficulty === 'medium'
                              ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {issue.difficulty}
                          </span>
                          <h5 className="font-outfit font-bold text-xs text-ink0">
                            {issue.title}
                          </h5>
                        </div>
                        <a
                          href={issue.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[0.68rem] text-ink2 hover:underline hover:text-ink1 mt-1 block"
                        >
                          View github issue #{issue.id.split('-')[1] || 'link'}
                        </a>
                      </div>

                      <div>
                        {issue.status === 'open' ? (
                          <button
                            onClick={() => onClaimIssue(project.id, issue.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                          >
                            Claim Issue
                          </button>
                        ) : (
                          <span className="text-[0.65rem] font-dmmono text-ink2 bg-bg3 border border-ink3 px-2.5 py-1 rounded inline-flex items-center gap-1">
                            <CheckIcon className="w-3 h-3 fill-current text-ink2" />
                            <span>Claimed</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-ink2 italic text-xs">
                    No open issues are currently designated for this showcase. Check GitHub codebase directly.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-bg0 border-t border-ink3 flex justify-between items-center text-xs text-ink2 font-dmmono">
          <span>ID: {project.id}</span>
          <button
            onClick={onClose}
            className="text-ink1 hover:text-ink0 font-semibold px-4 py-2 border border-ink3 hover:border-ink2 rounded-lg"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
