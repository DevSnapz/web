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
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-20 text-center">
        <div className="bg-bg1 border border-ink3 rounded-2xl p-12 max-w-md mx-auto shadow-2xl">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="font-outfit font-extrabold text-2xl text-ink0 mb-2">Project Not Found</h2>
          <p className="text-sm text-ink1 mb-6">
            The project you are looking for may have been removed or does not exist.
          </p>
          <Link
            to="/explore"
            className="bg-g text-bg0 font-semibold px-5 py-2.5 rounded-lg text-xs font-dmmono inline-flex items-center gap-2 hover:shadow-[0_0_15px_rgba(27,206,146,0.3)]"
          >
            ← Back to Showcase Gallery
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
    <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-8 relative z-10">
      
      {/* Top Breadcrumb & Return Link */}
      <div className="mb-6">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-xs font-dmmono text-ink1 hover:text-g transition-colors"
        >
          ← Back to Showcase Gallery
        </Link>
      </div>

      {/* Hero Banner Card */}
      <div className="bg-bg1 border border-ink3 rounded-2xl overflow-hidden shadow-2xl mb-8">
        <div className={`h-36 sm:h-44 bg-gradient-to-r ${project.bannerGradient || 'from-emerald-600 to-teal-800'} relative p-6 flex flex-col justify-between`}>
          <div className="flex items-center justify-between gap-4">
            <span className="font-dmmono text-xs text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              Campus Project ID: {project.id}
            </span>
            <div className="flex items-center gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-dmmono text-xs bg-black/50 hover:bg-black/70 text-white px-3 py-1 rounded-md border border-white/20 transition-colors"
                >
                  Live Demo ↗
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-dmmono text-xs bg-black/50 hover:bg-black/70 text-white px-3 py-1 rounded-md border border-white/20 transition-colors"
                >
                  GitHub ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Project Header Info */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-ink3">
            <div>
              <h1 className="font-outfit font-extrabold text-3xl sm:text-4xl text-ink0 leading-tight">
                {project.title}
              </h1>
              <p className="text-base text-g-text font-medium mt-1.5">{project.pitch}</p>
            </div>

            {/* Creator Badge */}
            <div className="flex items-center gap-3 bg-bg2 border border-ink3 px-4 py-2.5 rounded-xl self-start">
              <img
                src={project.creatorAvatar}
                alt={project.creatorName}
                className="w-10 h-10 rounded-full object-cover border border-g-dim"
              />
              <div>
                <div className="text-[0.7rem] font-dmmono text-ink2 uppercase">Project Lead</div>
                <div className="font-outfit font-bold text-sm text-ink0">{project.creatorName}</div>
                {project.creatorGithub && (
                  <a
                    href={`https://github.com/${project.creatorGithub}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.72rem] font-dmmono text-g hover:underline"
                  >
                    @{project.creatorGithub}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="py-6">
            <h2 className="font-dmmono text-xs uppercase tracking-wider text-ink2 mb-2">Project Overview</h2>
            <p className="text-sm text-ink1 leading-relaxed max-w-3xl">{project.description}</p>
          </div>

          {/* ========================================================= */}
          {/* SIGNATURE SKILL-GAP VISUALIZER WIDGET                     */}
          {/* ========================================================= */}
          <div className="bg-bg2/90 border border-ink3 rounded-xl p-5 sm:p-6 mb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
                <h3 className="font-outfit font-bold text-base text-ink0">Skill-Gap Analysis Matrix</h3>
              </div>
              <span className="font-dmmono text-[0.72rem] text-gold bg-gold/10 border border-gold/30 px-2.5 py-0.5 rounded-full">
                {activeOpenRoles.length > 0 ? `${activeOpenRoles.length} Open Gaps Identified` : 'Full Team Assembled'}
              </span>
            </div>

            <p className="text-xs text-ink1 mb-5 leading-relaxed">
              DevSnapz analyzes the project specification to compare the founder's known technical competencies against open project requirements.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column: Team Has */}
              <div className="bg-bg1 border border-ink3 rounded-lg p-4">
                <div className="flex items-center gap-2 text-xs font-dmmono text-g mb-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-g" />
                  <span>Team Known Competencies ({knownSkills.length > 0 ? knownSkills.length : project.techStack.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(knownSkills.length > 0 ? knownSkills : project.techStack).map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-dmmono bg-g/10 text-g-text border border-g-dim px-2.5 py-1 rounded"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Missing Skill Gaps */}
              <div className="bg-bg1 border border-gold/40 rounded-lg p-4">
                <div className="flex items-center gap-2 text-xs font-dmmono text-gold mb-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
                  <span>Identified Skill Gaps ({allGapSkills.length})</span>
                </div>
                {allGapSkills.length === 0 ? (
                  <p className="text-xs text-ink2">No active skill gaps flagged for this build.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {allGapSkills.map((gap) => (
                      <span
                        key={gap}
                        className="text-xs font-dmmono bg-gold/10 text-gold border border-gold/40 px-2.5 py-1 rounded flex items-center gap-1 font-semibold"
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
          <div className="flex items-center gap-2 border-b border-ink3 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('collaborate')}
              className={`font-dmmono text-xs px-4 py-2 rounded-lg transition-all ${
                activeTab === 'collaborate'
                  ? 'bg-g text-bg0 font-bold shadow-[0_0_15px_rgba(27,206,146,0.3)]'
                  : 'text-ink1 hover:text-ink0 hover:bg-bg1'
              }`}
            >
              Open Roles ({activeOpenRoles.length})
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`font-dmmono text-xs px-4 py-2 rounded-lg transition-all ${
                activeTab === 'guide'
                  ? 'bg-g text-bg0 font-bold shadow-[0_0_15px_rgba(27,206,146,0.3)]'
                  : 'text-ink1 hover:text-ink0 hover:bg-bg1'
              }`}
            >
              Mentorship & Q&A ({project.guidanceTopics?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('contribute')}
              className={`font-dmmono text-xs px-4 py-2 rounded-lg transition-all ${
                activeTab === 'contribute'
                  ? 'bg-g text-bg0 font-bold shadow-[0_0_15px_rgba(27,206,146,0.3)]'
                  : 'text-ink1 hover:text-ink0 hover:bg-bg1'
              }`}
            >
              Issues & Tasks ({project.contributeIssues?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('sponsor')}
              className={`font-dmmono text-xs px-4 py-2 rounded-lg transition-all ${
                activeTab === 'sponsor'
                  ? 'bg-g text-bg0 font-bold shadow-[0_0_15px_rgba(27,206,146,0.3)]'
                  : 'text-ink1 hover:text-ink0 hover:bg-bg1'
              }`}
            >
              Milestones
            </button>
          </div>

          {/* TAB 1: COLLABORATE & OPEN ROLES */}
          {activeTab === 'collaborate' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-outfit font-extrabold text-xl text-ink0">Open Collaboration Roles</h3>
                <span className="text-xs font-dmmono text-ink2">One-click apply</span>
              </div>

              {openRolesList.length === 0 ? (
                <div className="bg-bg1 border border-ink3 rounded-xl p-8 text-center text-sm text-ink2">
                  No open roles defined yet for this project.
                </div>
              ) : (
                openRolesList.map((role) => (
                  <div
                    key={role.id}
                    className={`bg-bg1 border rounded-xl p-5 transition-all ${
                      role.status === 'open' ? 'border-ink3 hover:border-g-dim' : 'border-ink3/40 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h4 className="font-outfit font-bold text-lg text-ink0">{role.roleName}</h4>
                          <span
                            className={`text-[0.68rem] font-dmmono uppercase px-2 py-0.5 rounded ${
                              role.status === 'open'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-ink3 text-ink2'
                            }`}
                          >
                            {role.status}
                          </span>
                        </div>
                        <p className="text-xs text-ink1 mt-2 leading-relaxed">{role.description}</p>
                        
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {role.skillsNeeded.map((skill) => (
                            <span
                              key={skill}
                              className="text-[0.72rem] font-dmmono bg-bg2 text-ink1 border border-ink3 px-2 py-0.5 rounded"
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
                          className="font-dmmono text-xs bg-g text-bg0 font-bold px-4 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(27,206,146,0.3)] transition-all whitespace-nowrap self-start"
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
                <div className="bg-bg2 border-2 border-g rounded-xl p-6 shadow-2xl animate-fade-in mt-6">
                  <div className="flex items-center justify-between pb-4 border-b border-ink3 mb-5">
                    <div>
                      <h4 className="font-outfit font-extrabold text-lg text-ink0">
                        Apply for {selectedRole.roleName}
                      </h4>
                      <p className="text-xs text-ink1 mt-0.5">Pitch your skills directly to {project.creatorName}</p>
                    </div>
                    <button
                      onClick={() => setSelectedRole(null)}
                      className="text-ink2 hover:text-ink0 text-lg font-bold"
                    >
                      ×
                    </button>
                  </div>

                  {applicationSuccess ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6 text-center text-emerald-400">
                      <div className="text-2xl mb-2">🎉</div>
                      <div className="font-outfit font-bold text-base">Application Submitted!</div>
                      <p className="text-xs text-ink1 mt-1">The creator has been notified in their Creator Hub.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleApplicationSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-dmmono text-ink2 uppercase mb-1">Your Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Maya Patel"
                            value={applicantName}
                            onChange={(e) => setApplicantName(e.target.value)}
                            className="w-full bg-bg1 border border-ink3 rounded-lg px-3.5 py-2 text-xs text-ink0 outline-none focus:border-g"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-dmmono text-ink2 uppercase mb-1">Student Email</label>
                          <input
                            type="email"
                            required
                            placeholder="maya@student.edu"
                            value={applicantEmail}
                            onChange={(e) => setApplicantEmail(e.target.value)}
                            className="w-full bg-bg1 border border-ink3 rounded-lg px-3.5 py-2 text-xs text-ink0 outline-none focus:border-g"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-dmmono text-ink2 uppercase mb-1">Your Relevant Skills & Experience</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 2 years React, built campus event app with Tailwind & Supabase"
                          value={applicantSkills}
                          onChange={(e) => setApplicantSkills(e.target.value)}
                          className="w-full bg-bg1 border border-ink3 rounded-lg px-3.5 py-2 text-xs text-ink0 outline-none focus:border-g"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-dmmono text-ink2 uppercase mb-1">Introduction Pitch / Message</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Why do you want to collaborate on this project? What can you build?"
                          value={applicantMessage}
                          onChange={(e) => setApplicantMessage(e.target.value)}
                          className="w-full bg-bg1 border border-ink3 rounded-lg px-3.5 py-2 text-xs text-ink0 outline-none focus:border-g resize-none"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRole(null)}
                          className="px-4 py-2 border border-ink3 rounded-lg text-xs font-dmmono text-ink1 hover:text-ink0"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-g text-bg0 font-bold px-6 py-2 rounded-lg text-xs font-dmmono hover:shadow-[0_0_15px_rgba(27,206,146,0.3)] transition-all"
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
                <h3 className="font-outfit font-extrabold text-xl text-ink0">Technical Guidance & Mentorship</h3>
                <span className="text-xs font-dmmono text-ink2">Peer code advice</span>
              </div>

              {/* Ask Question Form */}
              <form onSubmit={handleAddQuestionSubmit} className="bg-bg1 border border-ink3 rounded-xl p-4 flex gap-3">
                <input
                  type="text"
                  placeholder="Ask a technical question about this architecture..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="flex-grow bg-bg2 border border-ink3 rounded-lg px-3.5 py-2 text-xs text-ink0 outline-none focus:border-g"
                />
                <button
                  type="submit"
                  className="bg-g text-bg0 font-bold px-4 py-2 rounded-lg text-xs font-dmmono hover:shadow-[0_0_15px_rgba(27,206,146,0.3)] whitespace-nowrap"
                >
                  Ask Question
                </button>
              </form>

              {/* Topics List */}
              <div className="space-y-4">
                {(project.guidanceTopics || []).length === 0 ? (
                  <div className="bg-bg1 border border-ink3 rounded-xl p-8 text-center text-sm text-ink2">
                    No guidance questions asked yet. Be the first to ask!
                  </div>
                ) : (
                  (project.guidanceTopics || []).map((topic) => (
                    <div key={topic.id} className="bg-bg1 border border-ink3 rounded-xl p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-outfit font-bold text-sm text-ink0">{topic.question}</h4>
                        <span className="text-[0.65rem] font-dmmono text-ink2 whitespace-nowrap">
                          {new Date(topic.askedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-[0.7rem] font-dmmono text-ink2">Asked by {topic.askedBy}</div>

                      {/* Replies */}
                      <div className="space-y-2.5 pt-2 pl-3 border-l-2 border-ink3">
                        {topic.replies.map((reply) => (
                          <div key={reply.id} className="bg-bg2 p-3 rounded-lg text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-dmmono font-semibold text-g-text flex items-center gap-1">
                                {reply.repliedBy}
                                {reply.isCreator && (
                                  <span className="text-[0.6rem] bg-g/10 border border-g-dim px-1.5 py-0.2 rounded text-g">
                                    Creator
                                  </span>
                                )}
                              </span>
                              <span className="text-[0.65rem] text-ink2">
                                {new Date(reply.repliedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-ink1 leading-relaxed">{reply.replyText}</p>
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
                            className="flex-grow bg-bg2 border border-ink3 rounded-lg px-3 py-1.5 text-xs text-ink0 outline-none focus:border-g"
                          />
                          <button
                            type="button"
                            onClick={() => handleReplySubmit(topic.id)}
                            className="bg-bg2 border border-ink3 hover:border-g text-xs font-dmmono text-ink0 px-3 py-1.5 rounded-lg transition-colors"
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
                <h3 className="font-outfit font-extrabold text-xl text-ink0">Claimable Tasks & Issues</h3>
                <span className="text-xs font-dmmono text-ink2">Student starter tasks</span>
              </div>

              {(project.contributeIssues || []).length === 0 ? (
                <div className="bg-bg1 border border-ink3 rounded-xl p-8 text-center text-sm text-ink2">
                  No issues listed yet for this project.
                </div>
              ) : (
                (project.contributeIssues || []).map((issue) => (
                  <div
                    key={issue.id}
                    className="bg-bg1 border border-ink3 rounded-xl p-4 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[0.65rem] font-dmmono uppercase px-2 py-0.5 rounded ${
                            issue.difficulty === 'easy'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : issue.difficulty === 'medium'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {issue.difficulty}
                        </span>
                        <span className="font-outfit font-semibold text-sm text-ink0">{issue.title}</span>
                      </div>
                      <a
                        href={issue.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.7rem] font-dmmono text-g hover:underline mt-1 inline-block"
                      >
                        View on GitHub ↗
                      </a>
                    </div>

                    <div>
                      {issue.status === 'open' && (
                        <button
                          onClick={() => onClaimIssue(project.id, issue.id)}
                          className="bg-g text-bg0 font-dmmono text-xs font-bold px-3 py-1.5 rounded-md hover:shadow-[0_0_10px_rgba(27,206,146,0.3)] transition-all"
                        >
                          Claim Issue
                        </button>
                      )}
                      {issue.status === 'claimed' && (
                        <span className="text-xs font-dmmono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded">
                          Claimed
                        </span>
                      )}
                      {issue.status === 'merged' && (
                        <span className="text-xs font-dmmono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded">
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
                <h3 className="font-outfit font-extrabold text-xl text-ink0">Milestone Sponsorship</h3>
                <span className="text-xs font-dmmono text-ink2">Support student infrastructure</span>
              </div>

              {/* Funding Progress Bar */}
              {project.fundingGoal && (
                <div className="bg-bg1 border border-ink3 rounded-xl p-5">
                  <div className="flex items-center justify-between text-xs font-dmmono mb-2">
                    <span className="text-ink1">
                      Raised: <strong className="text-g">${project.fundingRaised || 0}</strong>
                    </span>
                    <span className="text-ink2">Goal: ${project.fundingGoal}</span>
                  </div>
                  <div className="w-full bg-bg2 rounded-full h-2.5 overflow-hidden border border-ink3">
                    <div
                      className="bg-g h-full transition-all duration-500"
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
                    className={`bg-bg1 border rounded-xl p-4 cursor-pointer transition-all ${
                      selectedTier?.id === tier.id ? 'border-g bg-g/5 shadow-[0_0_15px_rgba(27,206,146,0.2)]' : 'border-ink3 hover:border-ink2'
                    }`}
                  >
                    <div className="font-outfit font-bold text-sm text-ink0">{tier.name}</div>
                    <div className="text-xl font-extrabold text-g mt-1">${tier.amount}</div>
                    <p className="text-xs text-ink1 mt-2">{tier.benefits}</p>
                  </div>
                ))}
              </div>

              {/* Sponsor Form */}
              <form onSubmit={handleSponsorSubmit} className="bg-bg1 border border-ink3 rounded-xl p-6 space-y-4">
                <h4 className="font-outfit font-bold text-sm text-ink0">Back this Student Project</h4>
                {sponsorSuccess ? (
                  <div className="text-center text-xs text-emerald-400 py-3">
                    Thank you! Your sponsorship has been recorded.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-dmmono text-ink2 uppercase mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alex Chen"
                          value={sponsorName}
                          onChange={(e) => setSponsorName(e.target.value)}
                          className="w-full bg-bg2 border border-ink3 rounded-lg px-3 py-2 text-xs text-ink0 outline-none focus:border-g"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-dmmono text-ink2 uppercase mb-1">Amount ($ USD)</label>
                        <input
                          type="number"
                          required
                          placeholder="10"
                          value={selectedTier ? selectedTier.amount : customAmount}
                          onChange={(e) => {
                            setSelectedTier(null);
                            setCustomAmount(e.target.value);
                          }}
                          className="w-full bg-bg2 border border-ink3 rounded-lg px-3 py-2 text-xs text-ink0 outline-none focus:border-g"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-dmmono text-ink2 uppercase mb-1">Encouraging Note</label>
                      <input
                        type="text"
                        placeholder="Keep shipping!"
                        value={sponsorMessage}
                        onChange={(e) => setSponsorMessage(e.target.value)}
                        className="w-full bg-bg2 border border-ink3 rounded-lg px-3 py-2 text-xs text-ink0 outline-none focus:border-g"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-g text-bg0 font-bold px-6 py-2.5 rounded-lg text-xs font-dmmono hover:shadow-[0_0_15px_rgba(27,206,146,0.3)] transition-all"
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
          <div className="bg-bg1 border border-ink3 rounded-xl p-5 space-y-3">
            <h3 className="font-dmmono text-xs uppercase text-ink2 tracking-wider">Project Summary</h3>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-bg2 rounded-lg border border-ink3">
                <div className="text-xl font-extrabold text-ink0">{activeOpenRoles.length}</div>
                <div className="text-[0.68rem] font-dmmono text-ink2 uppercase">Open Roles</div>
              </div>
              <div className="p-3 bg-bg2 rounded-lg border border-ink3">
                <div className="text-xl font-extrabold text-g">{allGapSkills.length}</div>
                <div className="text-[0.68rem] font-dmmono text-ink2 uppercase">Skill Gaps</div>
              </div>
              <div className="p-3 bg-bg2 rounded-lg border border-ink3">
                <div className="text-xl font-extrabold text-ink0">{project.guidanceTopics?.length || 0}</div>
                <div className="text-[0.68rem] font-dmmono text-ink2 uppercase">Discussions</div>
              </div>
              <div className="p-3 bg-bg2 rounded-lg border border-ink3">
                <div className="text-xl font-extrabold text-ink0">{project.contributeIssues?.length || 0}</div>
                <div className="text-[0.68rem] font-dmmono text-ink2 uppercase">Open Issues</div>
              </div>
            </div>
          </div>

          {/* Full Tech Stack Tags */}
          <div className="bg-bg1 border border-ink3 rounded-xl p-5 space-y-3">
            <h3 className="font-dmmono text-xs uppercase text-ink2 tracking-wider">Full Technical Stack</h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="font-dmmono text-xs bg-bg2 text-ink1 border border-ink3 px-2.5 py-1 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Call to Action for Student Creators */}
          <div className="bg-gradient-to-br from-g/10 to-bg1 border border-g-dim rounded-xl p-5 text-center">
            <h4 className="font-outfit font-bold text-sm text-ink0">Building your own idea?</h4>
            <p className="text-xs text-ink1 mt-1 mb-4">
              Publish your project on DevSnapz to analyze missing skills and recruit student collaborators.
            </p>
            <Link
              to="/profile"
              className="bg-g text-bg0 font-dmmono text-xs font-bold px-4 py-2 rounded-lg inline-block hover:shadow-[0_0_15px_rgba(27,206,146,0.3)] transition-all"
            >
              Go to Your Profile ➔
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
