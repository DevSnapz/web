import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Project, OpenRole, SponsorshipTier } from '../types';
import {
  RepoIcon,
  StarIcon,
  StarFillIcon,
  HeartIcon,
  ZapIcon,
  CheckIcon,
  IssueOpenedIcon,
  IssueClosedIcon,
  GitPullRequestIcon,
  CommentDiscussionIcon,
  SearchIcon,
  GlobeIcon,
  OctocatIcon,
} from '../components/Octicons';

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
  onReplyToGuidance: (projectId: string, topicId: string, replyText: string, isCreator: boolean) => void;
  onClaimIssue: (projectId: string, issueId: string) => void;
}

type DevSnapzTab = 'overview' | 'tasks' | 'discussions' | 'milestones';

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

  const [activeTab, setActiveTab] = useState<DevSnapzTab>('overview');
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(38);

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
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="bg-[#151b23] border border-[#3d444d] rounded-md p-12 max-w-md mx-auto shadow-xs">
          <SearchIcon className="w-10 h-10 fill-current text-[#9198a1] mx-auto mb-4" />
          <h2 className="font-bold text-xl text-[#f0f6fc] mb-2">Project Showcase Not Found</h2>
          <p className="text-xs text-[#9198a1] mb-6">
            The project you are looking for may have been removed or does not exist.
          </p>
          <Link
            to="/explore"
            className="bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold px-4 py-2 rounded-md text-xs font-sans inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            ← Back to Explore Projects
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

  const toggleStar = () => {
    if (isStarred) {
      setIsStarred(false);
      setStarCount((c) => c - 1);
    } else {
      setIsStarred(true);
      setStarCount((c) => c + 1);
    }
  };

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
    onReplyToGuidance(project.id, topicId, text, false);
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

  const tabItemClass = (tab: DevSnapzTab) =>
    `flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
      activeTab === tab
        ? 'border-[#ff7b72] text-[#f0f6fc] font-semibold'
        : 'border-transparent text-[#9198a1] hover:text-[#f0f6fc] hover:border-[#656c76]'
    }`;

  const totalSkillPoints = knownSkills.length + allGapSkills.length;
  const knownPercent = totalSkillPoints > 0 ? Math.round((knownSkills.length / totalSkillPoints) * 100) : 70;

  return (
    <div className="bg-[#0d1117] min-h-screen text-[#f0f6fc]">
      
      {/* =================================================================== */}
      {/* 1. PROJECT SHOWCASE HEADER BAR (GitHub Primer Styling)              */}
      {/* =================================================================== */}
      <div className="bg-[#151b23] border-b border-[#3d444d] pt-5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
            
            {/* Breadcrumbs: Creator / Project Title + Public Badge */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <RepoIcon className="w-4 h-4 fill-current text-[#79c0ff]" />

                <Link
                  to="/profile"
                  className="text-xs font-normal text-[#58a6ff] hover:underline"
                >
                  @{project.creatorGithub || project.creatorName.toLowerCase().replace(/\s+/g, '-')}
                </Link>
                <span className="text-[#656c76] text-xs">/</span>
                <span className="text-sm sm:text-base font-bold text-[#f0f6fc]">
                  {project.title}
                </span>

                <span className="text-[11px] font-medium text-[#79c0ff] bg-[rgba(56,139,253,0.15)] border border-[rgba(56,139,253,0.3)] rounded-full px-2.5 py-0.2">
                  Student Showcase
                </span>
                <span className="text-[11px] font-mono text-[#9198a1] border border-[#3d444d] rounded-full px-2 py-0.2">
                  {project.category || 'Engineering'}
                </span>
              </div>
              <p className="text-xs text-[#9198a1] mt-0.5 line-clamp-1">
                {project.pitch}
              </p>
            </div>

            {/* Quick Action Toolbar (Star, Sponsor, Links) */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              
              {/* Sponsor Button */}
              <button
                type="button"
                onClick={() => setActiveTab('milestones')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-[#ff7b72] border border-[#ff7b72]/40 rounded-md font-semibold transition-colors shadow-xs"
              >
                <HeartIcon className="w-3.5 h-3.5 fill-current text-[#ff7b72]" />
                <span>Sponsor</span>
              </button>

              {/* Star Button */}
              <div className="flex items-center border border-[#3d444d] rounded-md bg-[#21262d] overflow-hidden text-xs shadow-xs">
                <button
                  type="button"
                  onClick={toggleStar}
                  className={`px-3 py-1.5 hover:bg-[#30363d] font-semibold flex items-center gap-1.5 transition-colors ${
                    isStarred ? 'text-[#ff7b72]' : 'text-[#f0f6fc]'
                  }`}
                >
                  {isStarred ? (
                    <StarFillIcon className="w-3.5 h-3.5 fill-current text-[#ff7b72]" />
                  ) : (
                    <StarIcon className="w-3.5 h-3.5 fill-current text-[#9198a1]" />
                  )}
                  <span>{isStarred ? 'Starred' : 'Star'}</span>
                </button>
                <span className="px-2.5 py-1.5 bg-[#151b23] border-l border-[#3d444d] text-[#9198a1] font-mono text-[11px]">
                  {starCount}
                </span>
              </div>

              {/* External GitHub Repo Button */}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-[#f0f6fc] border border-[#3d444d] rounded-md font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  title="Open GitHub Codebase"
                >
                  <OctocatIcon className="w-3.5 h-3.5 fill-current text-[#9198a1]" />
                  <span className="hidden sm:inline">GitHub</span>
                  <span className="text-[#9198a1]">↗</span>
                </a>
              )}

              {/* Live Demo Button */}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#1f6feb] hover:bg-[#2a7aef] text-white rounded-md font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  title="Open Live Deployment"
                >
                  <GlobeIcon className="w-3.5 h-3.5 fill-current text-white" />
                  <span>Live App</span>
                  <span>↗</span>
                </a>
              )}

            </div>
          </div>

          {/* =============================================================== */}
          {/* 2. SUBNAV TABS (GitHub Primer Design Language)                   */}
          {/* =============================================================== */}
          <div className="flex items-center gap-1 overflow-x-auto border-t border-[#3d444d]/50">
            
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={tabItemClass('overview')}
            >
              <ZapIcon className="w-4 h-4 fill-current text-[#ff7b72]" />
              <span>Overview & Open Roles</span>
              <span className="bg-[#30363d] text-[#f0f6fc] rounded-full px-2 py-0.2 text-[10px] font-mono">
                {activeOpenRoles.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tasks')}
              className={tabItemClass('tasks')}
            >
              <IssueOpenedIcon className="w-4 h-4 fill-current text-[#79c0ff]" />
              <span>Starter Tasks</span>
              <span className="bg-[#30363d] text-[#f0f6fc] rounded-full px-2 py-0.2 text-[10px] font-mono">
                {project.contributeIssues?.length || 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('discussions')}
              className={tabItemClass('discussions')}
            >
              <CommentDiscussionIcon className="w-4 h-4 fill-current text-[#9198a1]" />
              <span>Discussions & Guidance</span>
              <span className="bg-[#30363d] text-[#f0f6fc] rounded-full px-2 py-0.2 text-[10px] font-mono">
                {project.guidanceTopics?.length || 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('milestones')}
              className={tabItemClass('milestones')}
            >
              <HeartIcon className="w-4 h-4 fill-current text-[#ff7b72]" />
              <span>Milestones & Funding</span>
              {project.fundingGoal && (
                <span className="bg-[#30363d] text-[#79c0ff] rounded-full px-2 py-0.2 text-[10px] font-mono">
                  ${project.fundingRaised || 0} / ${project.fundingGoal}
                </span>
              )}
            </button>

          </div>

        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. SHOWCASE BODY CONTENT                                            */}
      {/* =================================================================== */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* ================================================================= */}
        {/* SIGNATURE DEVSNAPZ FEATURE: SKILL-GAP DETECTION MATRIX            */}
        {/* ================================================================= */}
        <div className="bg-[#151b23] border border-[#3d444d] rounded-md p-4 sm:p-5 space-y-3.5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#3d444d]">
            <div className="flex items-center gap-2">
              <ZapIcon className="w-4 h-4 fill-current text-[#ff7b72]" />
              <h3 className="font-bold text-sm text-[#f0f6fc]">
                DevSnapz Skill-Gap Detection Matrix
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[rgba(248,81,73,0.15)] text-[#ff7b72] border border-[rgba(248,81,73,0.4)] self-start sm:self-auto">
              {allGapSkills.length} Critical Skill {allGapSkills.length === 1 ? 'Gap' : 'Gaps'} Flagged
            </span>
          </div>

          <p className="text-xs text-[#9198a1] leading-relaxed">
            Automated architectural breakdown comparing project requirements against current maintainer competencies:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Team Known Competencies (Dark Tritanopia Cyan) */}
            <div className="p-3.5 bg-[#010409] border border-[#3d444d] rounded-md space-y-2">
              <div className="text-xs font-bold text-[#79c0ff] flex items-center gap-1.5">
                <CheckIcon className="w-3.5 h-3.5 fill-current text-[#79c0ff]" />
                <span>Team Known Competencies ({knownSkills.length > 0 ? knownSkills.length : project.techStack.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(knownSkills.length > 0 ? knownSkills : project.techStack).map((s) => (
                  <span key={s} className="text-xs font-mono px-2 py-0.5 rounded bg-[rgba(56,139,253,0.15)] text-[#79c0ff] border border-[rgba(56,139,253,0.3)] flex items-center gap-1">
                    <CheckIcon className="w-3 h-3 fill-current" />
                    <span>{s}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Identified Skill Gaps (Dark Tritanopia Coral) */}
            <div className="p-3.5 bg-[#010409] border border-[rgba(248,81,73,0.4)] rounded-md space-y-2">
              <div className="text-xs font-bold text-[#ff7b72] flex items-center gap-1.5">
                <ZapIcon className="w-3.5 h-3.5 fill-current text-[#ff7b72]" />
                <span>Identified Skill Gaps ({allGapSkills.length})</span>
              </div>
              {allGapSkills.length === 0 ? (
                <span className="text-xs text-[#9198a1]">No open skill gaps currently flagged.</span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {allGapSkills.map((gap) => (
                    <span key={gap} className="text-xs font-mono px-2 py-0.5 rounded bg-[rgba(248,81,73,0.15)] text-[#ff7b72] border border-[rgba(248,81,73,0.4)] flex items-center gap-1">
                      <ZapIcon className="w-3 h-3 fill-current" />
                      <span>Need: {gap}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Skill Coverage Ratio Bar */}
          <div className="pt-1 space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-[#9198a1]">
              <span className="text-[#79c0ff]">Verified Stack: {knownPercent}%</span>
              <span className="text-[#ff7b72]">Gaps to Ship: {100 - knownPercent}%</span>
            </div>
            <div className="w-full bg-[#010409] h-2 rounded-full overflow-hidden flex border border-[#3d444d]">
              <div className="bg-[#79c0ff] h-full transition-all" style={{ width: `${knownPercent}%` }} />
              <div className="bg-[#ff7b72] h-full transition-all" style={{ width: `${100 - knownPercent}%` }} />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: OVERVIEW & OPEN ROLES                                      */}
        {/* ================================================================= */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 8 Cols: Project Pitch, About, Architecture & Roles */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* About & Technical Architecture Box */}
              <div className="border border-[#3d444d] rounded-md bg-[#151b23] p-5 sm:p-6 space-y-5 shadow-xs">
                <div>
                  <h2 className="text-base font-bold text-[#f0f6fc] pb-2 border-b border-[#3d444d]">
                    About this Project
                  </h2>
                  <p className="text-xs text-[#9198a1] mt-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-mono font-bold text-[#79c0ff] uppercase tracking-wider mb-2">
                    Technical Stack & Ecosystem
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 bg-[#21262d] border border-[#3d444d] rounded-md font-mono text-xs text-[#58a6ff]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Collaborative Application Drawer (if a role is selected) */}
              {selectedRole && (
                <div className="border border-[#1f6feb] rounded-md bg-[#151b23] p-6 shadow-xl animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-[#3d444d] mb-4">
                    <div>
                      <h3 className="font-bold text-base text-[#f0f6fc] flex items-center gap-2">
                        <GitPullRequestIcon className="w-4 h-4 fill-current text-[#79c0ff]" />
                        <span>Apply for Role: <span className="text-[#58a6ff]">{selectedRole.roleName}</span></span>
                      </h3>
                      <p className="text-xs text-[#9198a1] mt-0.5">Pitch your competencies to join the repository team.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedRole(null)}
                      className="text-[#9198a1] hover:text-[#f0f6fc] text-lg font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {applicationSuccess ? (
                    <div className="p-4 bg-[rgba(56,139,253,0.15)] border border-[rgba(56,139,253,0.4)] rounded-md text-center text-xs text-[#79c0ff] font-semibold flex items-center justify-center gap-2">
                      <CheckIcon className="w-4 h-4 fill-current text-[#79c0ff]" />
                      <span>Collaboration request submitted! The project maintainer has been notified.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleApplicationSubmit} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#9198a1] uppercase font-mono text-[11px] mb-1">Your Name</label>
                          <input
                            type="text"
                            required
                            value={applicantName}
                            onChange={(e) => setApplicantName(e.target.value)}
                            placeholder="e.g. Maya Patel"
                            className="w-full px-3 py-2 bg-[#010409] border border-[#3d444d] rounded-md text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#9198a1] uppercase font-mono text-[11px] mb-1">GitHub / Contact Handle</label>
                          <input
                            type="text"
                            required
                            value={applicantEmail}
                            onChange={(e) => setApplicantEmail(e.target.value)}
                            placeholder="@maya-dev or maya@student.edu"
                            className="w-full px-3 py-2 bg-[#010409] border border-[#3d444d] rounded-md text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#9198a1] uppercase font-mono text-[11px] mb-1">Matching Competencies</label>
                        <input
                          type="text"
                          required
                          value={applicantSkills}
                          onChange={(e) => setApplicantSkills(e.target.value)}
                          className="w-full px-3 py-2 bg-[#010409] border border-[#3d444d] rounded-md text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#9198a1] uppercase font-mono text-[11px] mb-1">Collaboration Pitch / Cover Note</label>
                        <textarea
                          rows={3}
                          required
                          value={applicantMessage}
                          onChange={(e) => setApplicantMessage(e.target.value)}
                          placeholder="Why do you want to collaborate on this repository? What architectural components can you ship?"
                          className="w-full px-3 py-2 bg-[#010409] border border-[#3d444d] rounded-md text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] resize-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRole(null)}
                          className="px-3 py-1.5 border border-[#3d444d] rounded-md text-[#9198a1] hover:text-[#f0f6fc]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md shadow-xs"
                        >
                          Submit Collaboration Request ➔
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Open Collaboration Roles Section */}
              <div className="border border-[#3d444d] rounded-md bg-[#151b23] overflow-hidden shadow-xs">
                <div className="bg-[#151b23] border-b border-[#3d444d] px-4 py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ZapIcon className="w-4 h-4 fill-current text-[#ff7b72]" />
                    <span className="font-bold text-[#f0f6fc]">
                      Open Collaboration Roles ({openRolesList.length})
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#9198a1]">
                    Apply to join the maintainer team
                  </span>
                </div>

                {openRolesList.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#9198a1]">
                    No open roles currently listed for this project.
                  </div>
                ) : (
                  <div className="divide-y divide-[#3d444d]">
                    {openRolesList.map((role) => (
                      <div
                        key={role.id}
                        className="p-4 hover:bg-[#21262d]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-sm text-[#f0f6fc] flex items-center gap-2">
                            <span>{role.roleName}</span>
                            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[rgba(56,139,253,0.15)] text-[#79c0ff] border border-[rgba(56,139,253,0.3)]">
                              {role.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#9198a1] leading-relaxed max-w-xl">
                            {role.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {role.skillsNeeded.map((s) => (
                              <span
                                key={s}
                                className="text-xs font-mono px-2 py-0.5 rounded bg-[#21262d] text-[#ff7b72] border border-[#3d444d] flex items-center gap-1"
                              >
                                <ZapIcon className="w-3 h-3 fill-current text-[#ff7b72]" />
                                <span>{s}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {role.status === 'open' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRole(role);
                              setApplicantSkills(role.skillsNeeded.join(', '));
                            }}
                            className="px-4 py-1.5 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md text-xs shadow-xs whitespace-nowrap self-start sm:self-auto"
                          >
                            Apply for Role ➔
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right 4 Cols: Project Sidebar (Project Lead, Links, Metrics) */}
            <div className="lg:col-span-4 space-y-5 text-xs text-[#f0f6fc]">
              
              {/* Project Lead Profile Card */}
              <div className="border border-[#3d444d] rounded-md bg-[#151b23] p-4 space-y-3 shadow-xs">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#9198a1] font-mono">
                  Project Lead
                </h3>
                <div className="flex items-center gap-3">
                  <img
                    src={project.creatorAvatar}
                    alt={project.creatorName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-[#3d444d]"
                  />
                  <div>
                    <div className="font-bold text-sm text-[#f0f6fc]">{project.creatorName}</div>
                    <div className="text-[11px] font-mono text-[#58a6ff]">
                      @{project.creatorGithub || project.creatorName.toLowerCase().replace(/\s+/g, '-')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Codebase & Deployment Links */}
              <div className="border border-[#3d444d] rounded-md bg-[#151b23] p-4 space-y-2.5 shadow-xs">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#9198a1] font-mono">
                  Codebase & Links
                </h3>
                <div className="space-y-2 pt-1">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-2.5 rounded-md bg-[#010409] hover:bg-[#21262d] border border-[#3d444d] font-semibold text-[#58a6ff] hover:underline"
                    >
                      <span className="flex items-center gap-2">
                        <OctocatIcon className="w-4 h-4 fill-current text-[#9198a1]" />
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
                      className="w-full flex items-center justify-between p-2.5 rounded-md bg-[#010409] hover:bg-[#21262d] border border-[#3d444d] font-semibold text-[#79c0ff] hover:underline"
                    >
                      <span className="flex items-center gap-2">
                        <GlobeIcon className="w-4 h-4 fill-current text-[#79c0ff]" />
                        <span>Live Deployment</span>
                      </span>
                      <span>↗</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Project Stats Summary */}
              <div className="border border-[#3d444d] rounded-md bg-[#151b23] p-4 space-y-2.5 shadow-xs">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#9198a1] font-mono">
                  Showcase Metrics
                </h3>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 bg-[#010409] border border-[#3d444d] rounded">
                    <div className="text-lg font-bold text-[#79c0ff]">{knownSkills.length}</div>
                    <div className="text-[10px] font-mono text-[#9198a1] uppercase">Known Skills</div>
                  </div>
                  <div className="p-2.5 bg-[#010409] border border-[rgba(248,81,73,0.4)] rounded">
                    <div className="text-lg font-bold text-[#ff7b72]">{allGapSkills.length}</div>
                    <div className="text-[10px] font-mono text-[#ff7b72] uppercase">Open Gaps</div>
                  </div>
                  <div className="p-2.5 bg-[#010409] border border-[#3d444d] rounded">
                    <div className="text-lg font-bold text-[#f0f6fc]">{project.contributeIssues?.length || 0}</div>
                    <div className="text-[10px] font-mono text-[#9198a1] uppercase">Starter Tasks</div>
                  </div>
                  <div className="p-2.5 bg-[#010409] border border-[#3d444d] rounded">
                    <div className="text-lg font-bold text-[#f0f6fc]">{project.guidanceTopics?.length || 0}</div>
                    <div className="text-[10px] font-mono text-[#9198a1] uppercase">Discussions</div>
                  </div>
                </div>
              </div>

              {/* Student Project Builder CTA */}
              <div className="border border-[#3d444d] rounded-md bg-[#151b23] p-4 text-center space-y-2 shadow-xs">
                <h4 className="font-bold text-sm text-[#f0f6fc]">Building a Project?</h4>
                <p className="text-xs text-[#9198a1] leading-relaxed">
                  List your repository on DevSnapz to analyze missing engineering competencies and discover student collaborators.
                </p>
                <Link
                  to="/profile"
                  className="w-full inline-block mt-2 py-1.5 px-3 bg-[#21262d] hover:bg-[#30363d] border border-[#3d444d] text-xs font-semibold rounded-md text-[#58a6ff] hover:underline"
                >
                  Go to Your Profile ➔
                </Link>
              </div>

            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: STARTER TASKS (Good First Issues)                          */}
        {/* ================================================================= */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            
            {/* Header / Filter Notice */}
            <div className="flex items-center justify-between text-xs text-[#9198a1]">
              <span>Claim beginner-friendly tasks to start contributing to this repository.</span>
              <span className="font-mono">{project.contributeIssues?.length || 0} Open Starter Tasks</span>
            </div>

            {/* GitHub Issues Style Table */}
            <div className="border border-[#3d444d] rounded-md bg-[#151b23] overflow-hidden shadow-xs">
              <div className="bg-[#151b23] border-b border-[#3d444d] px-4 py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 font-semibold text-[#f0f6fc]">
                  <span className="flex items-center gap-1.5 text-[#79c0ff]">
                    <IssueOpenedIcon className="w-3.5 h-3.5 fill-current text-[#79c0ff]" />
                    <span>{project.contributeIssues?.length || 0} Open Tasks</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[#9198a1]">
                    <IssueClosedIcon className="w-3.5 h-3.5 fill-current text-[#9198a1]" />
                    <span>0 Closed</span>
                  </span>
                </div>
                <div className="text-xs text-[#9198a1] font-mono">
                  Sort: Newest
                </div>
              </div>

              {(project.contributeIssues || []).length === 0 ? (
                <div className="p-8 text-center text-xs text-[#9198a1]">
                  No starter tasks currently open for this repository.
                </div>
              ) : (
                <div className="divide-y divide-[#3d444d]">
                  {project.contributeIssues?.map((issue, idx) => (
                    <div
                      key={issue.id}
                      className="p-4 hover:bg-[#21262d]/50 transition-colors flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <IssueOpenedIcon className="w-3.5 h-3.5 fill-current text-[#79c0ff] mt-0.5 shrink-0" />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-[#f0f6fc] hover:text-[#58a6ff] cursor-pointer">
                              {issue.title}
                            </span>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.2 rounded-full bg-[rgba(56,139,253,0.15)] text-[#79c0ff] border border-[rgba(56,139,253,0.3)] font-bold">
                              {issue.difficulty}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[rgba(248,81,73,0.15)] text-[#ff7b72] border border-[rgba(248,81,73,0.3)]">
                              good first issue
                            </span>
                          </div>
                          <div className="text-[11px] text-[#9198a1] mt-1 font-mono">
                            #{idx + 1} opened for students by @{project.creatorGithub || project.creatorName}
                          </div>
                        </div>
                      </div>

                      <div>
                        {issue.status === 'open' && (
                          <button
                            type="button"
                            onClick={() => onClaimIssue(project.id, issue.id)}
                            className="px-3.5 py-1.5 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md shadow-xs text-xs whitespace-nowrap"
                          >
                            Claim Task
                          </button>
                        )}
                        {issue.status === 'claimed' && (
                          <span className="px-2.5 py-1 rounded bg-[#21262d] border border-[#3d444d] text-[#ff7b72] font-semibold text-xs flex items-center gap-1">
                            <CheckIcon className="w-3 h-3 fill-current" />
                            <span>Claimed</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: DISCUSSIONS (Architecture Guidance & Q&A)                  */}
        {/* ================================================================= */}
        {activeTab === 'discussions' && (
          <div className="space-y-6">
            
            {/* Ask Question Box */}
            <form onSubmit={handleAddQuestionSubmit} className="border border-[#3d444d] rounded-md bg-[#151b23] p-4 flex gap-3 text-xs shadow-xs">
              <input
                type="text"
                placeholder="Ask an engineering, system design, or architecture question..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="flex-grow bg-[#010409] border border-[#3d444d] rounded-md px-3 py-2 text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md shadow-xs whitespace-nowrap"
              >
                Ask Guidance
              </button>
            </form>

            {/* Discussions Thread List */}
            <div className="space-y-4">
              {(project.guidanceTopics || []).length === 0 ? (
                <div className="border border-[#3d444d] rounded-md bg-[#151b23] p-8 text-center text-xs text-[#9198a1]">
                  No architectural discussions started yet. Ask the first engineering question!
                </div>
              ) : (
                project.guidanceTopics?.map((topic) => (
                  <div key={topic.id} className="border border-[#3d444d] rounded-md bg-[#151b23] p-5 space-y-4 text-xs shadow-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <CommentDiscussionIcon className="w-4 h-4 fill-current text-[#58a6ff] shrink-0" />
                        <h4 className="font-bold text-sm text-[#f0f6fc]">{topic.question}</h4>
                      </div>
                      <span className="text-[11px] font-mono text-[#9198a1]">
                        {new Date(topic.askedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-3 pl-4 border-l-2 border-[#1f6feb]/40">
                      {topic.replies.map((reply) => (
                        <div key={reply.id} className="p-3 bg-[#010409] border border-[#3d444d] rounded-md space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-mono text-[#58a6ff] font-semibold flex items-center gap-1.5">
                              @{reply.repliedBy.toLowerCase()}
                              {reply.isCreator && (
                                <span className="px-1.5 py-0.2 rounded bg-[rgba(56,139,253,0.15)] text-[#79c0ff] border border-[rgba(56,139,253,0.3)] text-[10px]">
                                  Maintainer
                                </span>
                              )}
                            </span>
                            <span className="text-[#9198a1]">
                              {new Date(reply.repliedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[#f0f6fc] leading-relaxed">{reply.replyText}</p>
                        </div>
                      ))}

                      {/* Reply Input */}
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Reply with guidance or code advice..."
                          value={replyInput[topic.id] || ''}
                          onChange={(e) =>
                            setReplyInput((prev) => ({ ...prev, [topic.id]: e.target.value }))
                          }
                          className="flex-grow px-3 py-1.5 bg-[#010409] border border-[#3d444d] rounded-md text-[#f0f6fc] text-xs focus:outline-none focus:border-[#58a6ff]"
                        />
                        <button
                          type="button"
                          onClick={() => handleReplySubmit(topic.id)}
                          className="px-3.5 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#3d444d] rounded-md text-[#f0f6fc] font-semibold"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: MILESTONES & FUNDING                                       */}
        {/* ================================================================= */}
        {activeTab === 'milestones' && (
          <div className="max-w-2xl mx-auto space-y-6 text-xs">
            
            {/* Infrastructure Goal Progress */}
            {project.fundingGoal && (
              <div className="border border-[#3d444d] rounded-md bg-[#151b23] p-5 space-y-3 shadow-xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#f0f6fc]">
                    Infrastructure & API Funding: ${project.fundingRaised || 0} raised
                  </span>
                  <span className="text-[#9198a1]">Target: ${project.fundingGoal}</span>
                </div>
                <div className="w-full bg-[#010409] h-2.5 rounded-full overflow-hidden border border-[#3d444d]">
                  <div
                    className="bg-[#1f6feb] h-full"
                    style={{
                      width: `${Math.min(100, (((project.fundingRaised || 0) / project.fundingGoal) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Sponsorship Tiers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(project.sponsorshipTiers || []).map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier)}
                  className={`p-4 rounded-md border cursor-pointer transition-colors shadow-xs ${
                    selectedTier?.id === tier.id
                      ? 'border-[#ff7b72] bg-[rgba(248,81,73,0.15)] ring-1 ring-[#ff7b72]'
                      : 'border-[#3d444d] bg-[#151b23] hover:border-[#656c76]'
                  }`}
                >
                  <div className="font-bold text-sm text-[#f0f6fc]">{tier.name}</div>
                  <div className="text-xl font-extrabold text-[#ff7b72] mt-1">${tier.amount}</div>
                  <p className="text-[#9198a1] mt-2 leading-relaxed">{tier.benefits}</p>
                </div>
              ))}
            </div>

            {/* Sponsor Contribution Form */}
            <form onSubmit={handleSponsorSubmit} className="border border-[#3d444d] rounded-md bg-[#151b23] p-5 space-y-4 shadow-xs">
              <h4 className="font-bold text-sm text-[#f0f6fc] flex items-center gap-1.5">
                <HeartIcon className="w-4 h-4 fill-current text-[#ff7b72]" />
                <span>Sponsor this Student Project</span>
              </h4>
              {sponsorSuccess ? (
                <div className="p-3 bg-[rgba(56,139,253,0.15)] text-[#79c0ff] rounded-md font-semibold text-center flex items-center justify-center gap-2">
                  <CheckIcon className="w-4 h-4 fill-current" />
                  <span>Thank you! Your sponsorship has been recorded.</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#9198a1] text-[11px] font-mono uppercase mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={sponsorName}
                        onChange={(e) => setSponsorName(e.target.value)}
                        placeholder="Alex Chen"
                        className="w-full px-3 py-1.5 bg-[#010409] border border-[#3d444d] rounded-md text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9198a1] text-[11px] font-mono uppercase mb-1">Amount ($ USD)</label>
                      <input
                        type="number"
                        required
                        value={selectedTier ? selectedTier.amount : customAmount}
                        onChange={(e) => {
                          setSelectedTier(null);
                          setCustomAmount(e.target.value);
                        }}
                        placeholder="10"
                        className="w-full px-3 py-1.5 bg-[#010409] border border-[#3d444d] rounded-md text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#9198a1] text-[11px] font-mono uppercase mb-1">Support Note</label>
                    <input
                      type="text"
                      value={sponsorMessage}
                      onChange={(e) => setSponsorMessage(e.target.value)}
                      placeholder="Great student architecture! Keep shipping."
                      className="w-full px-3 py-1.5 bg-[#010409] border border-[#3d444d] rounded-md text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md shadow-xs transition-colors"
                  >
                    Confirm Sponsorship ➔
                  </button>
                </>
              )}
            </form>

          </div>
        )}

      </div>

    </div>
  );
}
