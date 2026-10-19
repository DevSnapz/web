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
        <div className="bg-[#151B2D]/90 border border-[#222F4C] rounded-2xl p-12 max-w-md mx-auto shadow-2xl">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="font-bold text-2xl text-white mb-2">Project Not Found</h2>
          <p className="text-sm text-slate-300 mb-6">
            The project you are looking for may have been removed or does not exist.
          </p>
          <Link
            to="/explore"
            className="bg-[#635BFF] hover:bg-[#5249e0] text-white font-semibold px-5 py-2.5 rounded-xl text-xs font-mono inline-flex items-center gap-2 shadow-md shadow-[#635BFF]/25 transition-all"
          >
            ← Back to Directory
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

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      
      {/* Top Breadcrumb & Return Link */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Back to Explore Directory</span>
        </Link>
        <span className="text-xs font-mono text-slate-500">
          ID: {project.id}
        </span>
      </div>

      {/* Hero Banner Card */}
      <div className="bg-[#151B2D]/90 border border-[#222F4C] rounded-2xl overflow-hidden shadow-2xl mb-8 backdrop-blur-md">
        <div className={`h-40 sm:h-48 bg-gradient-to-r ${project.bannerGradient || 'from-indigo-600 via-purple-600 to-pink-600'} relative p-6 flex flex-col justify-between`}>
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />
          
          <div className="relative z-10 flex items-center justify-between gap-4">
            <span className="font-mono text-xs text-white bg-[#0B1020]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              Student Innovation Hub
            </span>
            <div className="flex items-center gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs bg-[#0B1020]/80 hover:bg-[#0B1020] text-white px-3 py-1.5 rounded-xl border border-white/20 transition-colors shadow-sm flex items-center gap-1"
                >
                  <span>Live Demo</span>
                  <span>↗</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs bg-[#0B1020]/80 hover:bg-[#0B1020] text-white px-3 py-1.5 rounded-xl border border-white/20 transition-colors shadow-sm flex items-center gap-1"
                >
                  <span>GitHub</span>
                  <span>↗</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Project Header Info */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#222F4C]">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {project.title}
              </h1>
              <p className="text-base text-slate-300 font-medium mt-1.5 max-w-2xl leading-relaxed">
                {project.pitch}
              </p>
            </div>

            {/* Creator Badge */}
            <div className="flex items-center gap-3 bg-[#0B1020]/80 border border-[#222F4C] px-4 py-2.5 rounded-2xl self-start">
              <img
                src={project.creatorAvatar}
                alt={project.creatorName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#635BFF]/40 bg-[#151B2D]"
              />
              <div>
                <div className="text-[0.68rem] font-mono text-slate-400 uppercase">Project Lead</div>
                <div className="font-bold text-sm text-white">{project.creatorName}</div>
                {project.creatorGithub && (
                  <a
                    href={`https://github.com/${project.creatorGithub}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.7rem] font-mono text-[#635BFF] hover:underline"
                  >
                    @{project.creatorGithub}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="py-6">
            <h2 className="font-mono text-xs uppercase tracking-wider text-slate-400 mb-2">Project Overview</h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">{project.description}</p>
          </div>

          {/* ========================================================= */}
          {/* SIGNATURE SKILL-GAP VISUALIZER WIDGET                     */}
          {/* ========================================================= */}
          <div className="bg-[#0B1020]/70 border border-[#222F4C] rounded-2xl p-5 sm:p-6 mb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F9735B] animate-pulse" />
                <h3 className="font-bold text-base text-white">Skill-Gap Detection Matrix</h3>
              </div>
              <span className="font-mono text-xs text-[#F9735B] bg-[#F9735B]/15 border border-[#F9735B]/30 px-3 py-0.5 rounded-full font-medium">
                {activeOpenRoles.length > 0 ? `${activeOpenRoles.length} Open Gaps Identified` : 'Full Team Assembled'}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              DevSnapz analyzes the technical specification to map existing team proficiencies against required build competencies.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column: Team Has */}
              <div className="bg-[#151B2D] border border-[#222F4C] rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Team Known Competencies ({knownSkills.length > 0 ? knownSkills.length : project.techStack.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(knownSkills.length > 0 ? knownSkills : project.techStack).map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 px-2.5 py-1 rounded-lg"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Missing Skill Gaps */}
              <div className="bg-[#151B2D] border border-[#F9735B]/40 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#F9735B] mb-2.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F9735B] animate-ping" />
                  <span>Identified Skill Gaps ({allGapSkills.length})</span>
                </div>
                {allGapSkills.length === 0 ? (
                  <p className="text-xs text-slate-400">No active skill gaps flagged for this build.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {allGapSkills.map((gap) => (
                      <span
                        key={gap}
                        className="text-xs font-mono bg-[#F9735B]/15 text-[#ff8f79] border border-[#F9735B]/40 px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold"
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

      {/* Main Content & Interactive Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Interactive Tab Content (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tab Selector Buttons */}
          <div className="flex items-center gap-2 border-b border-[#222F4C] pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('collaborate')}
              className={`font-mono text-xs px-4 py-2 rounded-xl transition-all ${
                activeTab === 'collaborate'
                  ? 'bg-[#635BFF] text-white font-bold shadow-md shadow-[#635BFF]/25'
                  : 'text-slate-400 hover:text-white hover:bg-[#151B2D]'
              }`}
            >
              Open Roles ({activeOpenRoles.length})
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`font-mono text-xs px-4 py-2 rounded-xl transition-all ${
                activeTab === 'guide'
                  ? 'bg-[#635BFF] text-white font-bold shadow-md shadow-[#635BFF]/25'
                  : 'text-slate-400 hover:text-white hover:bg-[#151B2D]'
              }`}
            >
              Mentorship & Q&A ({project.guidanceTopics?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('contribute')}
              className={`font-mono text-xs px-4 py-2 rounded-xl transition-all ${
                activeTab === 'contribute'
                  ? 'bg-[#635BFF] text-white font-bold shadow-md shadow-[#635BFF]/25'
                  : 'text-slate-400 hover:text-white hover:bg-[#151B2D]'
              }`}
            >
              Tasks & Issues ({project.contributeIssues?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('sponsor')}
              className={`font-mono text-xs px-4 py-2 rounded-xl transition-all ${
                activeTab === 'sponsor'
                  ? 'bg-[#635BFF] text-white font-bold shadow-md shadow-[#635BFF]/25'
                  : 'text-slate-400 hover:text-white hover:bg-[#151B2D]'
              }`}
            >
              Milestones
            </button>
          </div>

          {/* TAB 1: COLLABORATE & OPEN ROLES */}
          {activeTab === 'collaborate' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xl text-white">Open Collaboration Roles</h3>
                <span className="text-xs font-mono text-slate-400">One-click application</span>
              </div>

              {openRolesList.length === 0 ? (
                <div className="bg-[#151B2D]/80 border border-[#222F4C] rounded-2xl p-8 text-center text-sm text-slate-400">
                  No open roles currently defined for this build.
                </div>
              ) : (
                openRolesList.map((role) => (
                  <div
                    key={role.id}
                    className={`bg-[#151B2D]/90 border rounded-2xl p-5 transition-all shadow-md ${
                      role.status === 'open'
                        ? 'border-[#222F4C] hover:border-[#635BFF]/40'
                        : 'border-[#222F4C]/40 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h4 className="font-bold text-lg text-white">{role.roleName}</h4>
                          <span
                            className={`text-[0.65rem] font-mono uppercase px-2.5 py-0.5 rounded-full ${
                              role.status === 'open'
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                : 'bg-[#0B1020] text-slate-400 border border-[#222F4C]'
                            }`}
                          >
                            {role.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">{role.description}</p>
                        
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {role.skillsNeeded.map((skill) => (
                            <span
                              key={skill}
                              className="text-[0.7rem] font-mono bg-[#0B1020]/70 text-slate-300 border border-[#222F4C] px-2 py-0.5 rounded-md"
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
                          className="font-mono text-xs bg-[#635BFF] hover:bg-[#5249e0] text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-[#635BFF]/25 transition-all whitespace-nowrap self-start"
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
                <div className="bg-[#151B2D] border-2 border-[#635BFF] rounded-2xl p-6 shadow-2xl animate-fade-in mt-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#222F4C] mb-5">
                    <div>
                      <h4 className="font-extrabold text-lg text-white">
                        Apply for {selectedRole.roleName}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Pitch your skills directly to {project.creatorName}</p>
                    </div>
                    <button
                      onClick={() => setSelectedRole(null)}
                      className="text-slate-400 hover:text-white text-lg font-bold"
                    >
                      ×
                    </button>
                  </div>

                  {applicationSuccess ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center text-emerald-400">
                      <div className="text-2xl mb-2">🎉</div>
                      <div className="font-bold text-base">Application Submitted!</div>
                      <p className="text-xs text-slate-300 mt-1">The creator has been notified in their Creator Hub.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleApplicationSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Your Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Maya Patel"
                            value={applicantName}
                            onChange={(e) => setApplicantName(e.target.value)}
                            className="w-full bg-[#0B1020] border border-[#222F4C] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#635BFF]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Student Email</label>
                          <input
                            type="email"
                            required
                            placeholder="maya@student.edu"
                            value={applicantEmail}
                            onChange={(e) => setApplicantEmail(e.target.value)}
                            className="w-full bg-[#0B1020] border border-[#222F4C] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#635BFF]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Your Relevant Skills & Experience</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 2 years React, built campus event app with Tailwind"
                          value={applicantSkills}
                          onChange={(e) => setApplicantSkills(e.target.value)}
                          className="w-full bg-[#0B1020] border border-[#222F4C] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#635BFF]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Introduction Pitch / Message</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Why do you want to collaborate on this project? What can you build?"
                          value={applicantMessage}
                          onChange={(e) => setApplicantMessage(e.target.value)}
                          className="w-full bg-[#0B1020] border border-[#222F4C] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#635BFF] resize-none"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRole(null)}
                          className="px-4 py-2 border border-[#222F4C] rounded-xl text-xs font-mono text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-[#635BFF] hover:bg-[#5249e0] text-white font-bold px-6 py-2 rounded-xl text-xs font-mono shadow-md shadow-[#635BFF]/25 transition-all"
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
                <h3 className="font-bold text-xl text-white">Technical Guidance & Mentorship</h3>
                <span className="text-xs font-mono text-slate-400">Peer architecture advice</span>
              </div>

              {/* Ask Question Form */}
              <form onSubmit={handleAddQuestionSubmit} className="bg-[#151B2D]/90 border border-[#222F4C] rounded-2xl p-4 flex gap-3 shadow-md">
                <input
                  type="text"
                  placeholder="Ask a technical question about this architecture..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="flex-grow bg-[#0B1020] border border-[#222F4C] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#635BFF]"
                />
                <button
                  type="submit"
                  className="bg-[#635BFF] hover:bg-[#5249e0] text-white font-semibold px-4 py-2 rounded-xl text-xs font-mono shadow-md shadow-[#635BFF]/25 whitespace-nowrap"
                >
                  Ask Question
                </button>
              </form>

              {/* Topics List */}
              <div className="space-y-4">
                {(project.guidanceTopics || []).length === 0 ? (
                  <div className="bg-[#151B2D]/80 border border-[#222F4C] rounded-2xl p-8 text-center text-sm text-slate-400">
                    No guidance questions asked yet. Be the first to ask!
                  </div>
                ) : (
                  (project.guidanceTopics || []).map((topic) => (
                    <div key={topic.id} className="bg-[#151B2D]/90 border border-[#222F4C] rounded-2xl p-5 space-y-3 shadow-md">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-bold text-sm text-white">{topic.question}</h4>
                        <span className="text-[0.65rem] font-mono text-slate-400 whitespace-nowrap">
                          {new Date(topic.askedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-[0.7rem] font-mono text-slate-400">Asked by @{topic.askedBy.toLowerCase()}</div>

                      {/* Replies */}
                      <div className="space-y-2.5 pt-2 pl-3 border-l-2 border-[#635BFF]/60">
                        {topic.replies.map((reply) => (
                          <div key={reply.id} className="bg-[#0B1020]/70 border border-[#222F4C] p-3 rounded-xl text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-semibold text-[#9D98FF] flex items-center gap-1">
                                @{reply.repliedBy.toLowerCase()}
                                {reply.isCreator && (
                                  <span className="text-[0.6rem] bg-[#635BFF]/15 border border-[#635BFF]/30 px-1.5 py-0.2 rounded text-[#9D98FF]">
                                    Project Lead
                                  </span>
                                )}
                              </span>
                              <span className="text-[0.65rem] text-slate-400">
                                {new Date(reply.repliedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{reply.replyText}</p>
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
                            className="flex-grow bg-[#0B1020] border border-[#222F4C] rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#635BFF]"
                          />
                          <button
                            type="button"
                            onClick={() => handleReplySubmit(topic.id)}
                            className="bg-[#151B2D] border border-[#222F4C] hover:border-[#635BFF] text-xs font-mono text-slate-200 px-3 py-1.5 rounded-xl transition-colors"
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
                <h3 className="font-bold text-xl text-white">Claimable Tasks & Issues</h3>
                <span className="text-xs font-mono text-slate-400">Starter engineering tasks</span>
              </div>

              {(project.contributeIssues || []).length === 0 ? (
                <div className="bg-[#151B2D]/80 border border-[#222F4C] rounded-2xl p-8 text-center text-sm text-slate-400">
                  No issues registered yet for this project.
                </div>
              ) : (
                (project.contributeIssues || []).map((issue) => (
                  <div
                    key={issue.id}
                    className="bg-[#151B2D]/90 border border-[#222F4C] rounded-2xl p-4 flex items-center justify-between gap-4 shadow-md"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[0.62rem] font-mono uppercase px-2 py-0.5 rounded-full border ${
                            issue.difficulty === 'easy'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : issue.difficulty === 'medium'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {issue.difficulty}
                        </span>
                        <span className="font-semibold text-sm text-white">{issue.title}</span>
                      </div>
                      <a
                        href={issue.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.7rem] font-mono text-[#635BFF] hover:underline mt-1 inline-block"
                      >
                        View on GitHub ↗
                      </a>
                    </div>

                    <div>
                      {issue.status === 'open' && (
                        <button
                          onClick={() => onClaimIssue(project.id, issue.id)}
                          className="bg-[#635BFF] hover:bg-[#5249e0] text-white font-mono text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md shadow-[#635BFF]/20 transition-all"
                        >
                          Claim Issue
                        </button>
                      )}
                      {issue.status === 'claimed' && (
                        <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                          Claimed
                        </span>
                      )}
                      {issue.status === 'merged' && (
                        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
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
                <h3 className="font-bold text-xl text-white">Milestone Sponsorship</h3>
                <span className="text-xs font-mono text-slate-400">Support student infrastructure</span>
              </div>

              {/* Funding Progress Bar */}
              {project.fundingGoal && (
                <div className="bg-[#151B2D]/90 border border-[#222F4C] rounded-2xl p-5 shadow-md">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-slate-300">
                      Raised: <strong className="text-white">${project.fundingRaised || 0}</strong>
                    </span>
                    <span className="text-slate-400">Goal: ${project.fundingGoal}</span>
                  </div>
                  <div className="w-full bg-[#0B1020] rounded-full h-2.5 overflow-hidden border border-[#222F4C]">
                    <div
                      className="bg-[#635BFF] h-full transition-all duration-500 rounded-full"
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
                    className={`bg-[#151B2D]/90 border rounded-2xl p-4 cursor-pointer transition-all shadow-md ${
                      selectedTier?.id === tier.id
                        ? 'border-[#635BFF] bg-[#635BFF]/10 shadow-lg shadow-[#635BFF]/20 ring-1 ring-[#635BFF]'
                        : 'border-[#222F4C] hover:border-[#635BFF]/40'
                    }`}
                  >
                    <div className="font-bold text-sm text-white">{tier.name}</div>
                    <div className="text-xl font-extrabold text-[#635BFF] mt-1">${tier.amount}</div>
                    <p className="text-xs text-slate-300 mt-2">{tier.benefits}</p>
                  </div>
                ))}
              </div>

              {/* Sponsor Form */}
              <form onSubmit={handleSponsorSubmit} className="bg-[#151B2D]/90 border border-[#222F4C] rounded-2xl p-6 space-y-4 shadow-md">
                <h4 className="font-bold text-sm text-white">Back this Student Project</h4>
                {sponsorSuccess ? (
                  <div className="text-center text-xs text-emerald-400 py-3">
                    Thank you! Your sponsorship has been recorded.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alex Chen"
                          value={sponsorName}
                          onChange={(e) => setSponsorName(e.target.value)}
                          className="w-full bg-[#0B1020] border border-[#222F4C] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#635BFF]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Amount ($ USD)</label>
                        <input
                          type="number"
                          required
                          placeholder="10"
                          value={selectedTier ? selectedTier.amount : customAmount}
                          onChange={(e) => {
                            setSelectedTier(null);
                            setCustomAmount(e.target.value);
                          }}
                          className="w-full bg-[#0B1020] border border-[#222F4C] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#635BFF]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Encouraging Note</label>
                      <input
                        type="text"
                        placeholder="Keep shipping!"
                        value={sponsorMessage}
                        onChange={(e) => setSponsorMessage(e.target.value)}
                        className="w-full bg-[#0B1020] border border-[#222F4C] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#635BFF]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#635BFF] hover:bg-[#5249e0] text-white font-bold px-6 py-2.5 rounded-xl text-xs font-mono shadow-md shadow-[#635BFF]/25 transition-all"
                    >
                      Confirm Sponsorship ➔
                    </button>
                  </>
                )}
              </form>
            </div>
          )}

        </div>

        {/* Right Column: Project Sidebar (1/3 width) */}
        <div className="space-y-6">
          
          {/* Quick Metrics */}
          <div className="bg-[#151B2D]/90 border border-[#222F4C] rounded-2xl p-5 space-y-3 shadow-md">
            <h3 className="font-mono text-xs uppercase text-slate-400 tracking-wider">Project Summary</h3>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#0B1020]/70 rounded-xl border border-[#222F4C]">
                <div className="text-xl font-extrabold text-white">{activeOpenRoles.length}</div>
                <div className="text-[0.68rem] font-mono text-slate-400 uppercase">Open Roles</div>
              </div>
              <div className="p-3 bg-[#0B1020]/70 rounded-xl border border-[#222F4C]">
                <div className="text-xl font-extrabold text-[#F9735B]">{allGapSkills.length}</div>
                <div className="text-[0.68rem] font-mono text-slate-400 uppercase">Skill Gaps</div>
              </div>
              <div className="p-3 bg-[#0B1020]/70 rounded-xl border border-[#222F4C]">
                <div className="text-xl font-extrabold text-white">{project.guidanceTopics?.length || 0}</div>
                <div className="text-[0.68rem] font-mono text-slate-400 uppercase">Discussions</div>
              </div>
              <div className="p-3 bg-[#0B1020]/70 rounded-xl border border-[#222F4C]">
                <div className="text-xl font-extrabold text-white">{project.contributeIssues?.length || 0}</div>
                <div className="text-[0.68rem] font-mono text-slate-400 uppercase">Open Tasks</div>
              </div>
            </div>
          </div>

          {/* Full Tech Stack Tags */}
          <div className="bg-[#151B2D]/90 border border-[#222F4C] rounded-2xl p-5 space-y-3 shadow-md">
            <h3 className="font-mono text-xs uppercase text-slate-400 tracking-wider">Full Technical Stack</h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs bg-[#0B1020]/70 text-slate-300 border border-[#222F4C] px-2.5 py-1 rounded-lg"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Call to Action for Student Creators */}
          <div className="bg-[#151B2D]/90 border border-[#222F4C] rounded-2xl p-5 text-center shadow-md">
            <h4 className="font-bold text-sm text-white">Building your own idea?</h4>
            <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
              Publish your project on DevSnapz to analyze missing skills and recruit student collaborators.
            </p>
            <Link
              to="/profile"
              className="bg-[#635BFF] hover:bg-[#5249e0] text-white font-mono text-xs font-semibold px-4 py-2 rounded-xl inline-block shadow-md shadow-[#635BFF]/25 transition-all"
            >
              Go to Your Profile ➔
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
