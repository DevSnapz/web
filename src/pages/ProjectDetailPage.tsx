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

type GitHubRepoTab = 'code' | 'issues' | 'pulls' | 'discussions' | 'gaps' | 'sponsor';

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

  const [activeTab, setActiveTab] = useState<GitHubRepoTab>('code');
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(38);
  const [codeDropdownOpen, setCodeDropdownOpen] = useState(false);

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
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="font-bold text-xl text-[#f0f6fc] mb-2">Repository Not Found</h2>
          <p className="text-xs text-[#9198a1] mb-6">
            The repository you are looking for may have been removed or does not exist.
          </p>
          <Link
            to="/explore"
            className="bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold px-4 py-2 rounded-md text-xs font-sans inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            ← Back to Explore Repositories
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

  const tabItemClass = (tab: GitHubRepoTab) =>
    `flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
      activeTab === tab
        ? 'border-[#ff7b72] text-[#f0f6fc] font-semibold'
        : 'border-transparent text-[#9198a1] hover:text-[#f0f6fc] hover:border-[#656c76]'
    }`;

  return (
    <div className="bg-[#0d1117] min-h-screen text-[#f0f6fc]">
      
      {/* =================================================================== */}
      {/* 1. GITHUB REPOSITORY HEADER BAR                                     */}
      {/* =================================================================== */}
      <div className="bg-[#151b23] border-b border-[#3d444d] pt-4">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
            {/* Repo Breadcrumbs: Owner / Repo-name + Public pill */}
            <div className="flex items-center gap-2 flex-wrap">
              <svg className="w-4 h-4 fill-current text-[#9198a1]" viewBox="0 0 16 16">
                <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
              </svg>

              <Link
                to="/profile"
                className="text-xs font-normal text-[#58a6ff] hover:underline"
              >
                {project.creatorGithub || project.creatorName.toLowerCase().replace(/\s+/g, '-')}
              </Link>
              <span className="text-[#656c76] text-xs">/</span>
              <span className="text-xs font-bold text-[#58a6ff] hover:underline">
                {project.id}
              </span>

              <span className="text-[11px] font-medium text-[#9198a1] border border-[#3d444d] rounded-full px-2 py-0.2">
                Public
              </span>
            </div>

            {/* GitHub Repo Action Buttons (Watch, Fork, Star, Sponsor) */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              
              {/* Sponsor Button */}
              <button
                type="button"
                onClick={() => setActiveTab('sponsor')}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#21262d] hover:bg-[#30363d] text-[#ff7b72] border border-[#ff7b72]/40 rounded-md font-semibold transition-colors shadow-xs"
              >
                <span>♡</span>
                <span>Sponsor</span>
              </button>

              {/* Watch Button */}
              <div className="flex items-center border border-[#3d444d] rounded-md bg-[#21262d] overflow-hidden text-xs">
                <button
                  type="button"
                  className="px-2.5 py-1 hover:bg-[#30363d] text-[#f0f6fc] font-semibold flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5 fill-current text-[#9198a1]" viewBox="0 0 16 16">
                    <path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.577.43 8.899a1.62 1.62 0 0 1 0-1.798c.45-.678 1.367-1.932 2.637-3.023C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.62 1.259 1.766 2.41 2.756C5.243 11.815 6.643 12.5 8 12.5c1.357 0 2.757-.685 3.91-1.676 1.152-.99 2-2.136 2.411-2.756a.12.12 0 0 0 0-.136c-.411-.62-1.259-1.766-2.41-2.756C10.757 4.185 9.357 3.5 8 3.5c-1.357 0-2.757.685-3.91 1.676-1.152.99-2 2.136-2.411 2.756ZM8 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
                  </svg>
                  <span>Watch</span>
                </button>
                <span className="px-2 py-1 bg-[#151b23] border-l border-[#3d444d] text-[#9198a1] font-mono text-[11px]">
                  6
                </span>
              </div>

              {/* Fork Button */}
              <div className="flex items-center border border-[#3d444d] rounded-md bg-[#21262d] overflow-hidden text-xs">
                <button
                  type="button"
                  className="px-2.5 py-1 hover:bg-[#30363d] text-[#f0f6fc] font-semibold flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5 fill-current text-[#9198a1]" viewBox="0 0 16 16">
                    <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878Zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm3-8.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  <span>Fork</span>
                </button>
                <span className="px-2 py-1 bg-[#151b23] border-l border-[#3d444d] text-[#9198a1] font-mono text-[11px]">
                  4
                </span>
              </div>

              {/* Star Button */}
              <div className="flex items-center border border-[#3d444d] rounded-md bg-[#21262d] overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={toggleStar}
                  className={`px-2.5 py-1 hover:bg-[#30363d] font-semibold flex items-center gap-1 transition-colors ${
                    isStarred ? 'text-[#ff7b72]' : 'text-[#f0f6fc]'
                  }`}
                >
                  <span>★</span>
                  <span>{isStarred ? 'Starred' : 'Star'}</span>
                </button>
                <span className="px-2 py-1 bg-[#151b23] border-l border-[#3d444d] text-[#9198a1] font-mono text-[11px]">
                  {starCount}
                </span>
              </div>

            </div>
          </div>

          {/* =============================================================== */}
          {/* 2. GITHUB REPOSITORY SUBNAV TABS                                */}
          {/* =============================================================== */}
          <div className="flex items-center gap-1 overflow-x-auto border-t border-[#3d444d]/50">
            
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={tabItemClass('code')}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                <path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.06 1.06L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z" />
              </svg>
              <span>Code</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gaps')}
              className={tabItemClass('gaps')}
            >
              <span className="text-[#ff7b72]">⚡</span>
              <span>Skill Gaps</span>
              <span className="bg-[#30363d] text-[#f0f6fc] rounded-full px-1.5 py-0.2 text-[10px] font-mono">
                {allGapSkills.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('issues')}
              className={tabItemClass('issues')}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
              </svg>
              <span>Issues</span>
              <span className="bg-[#30363d] text-[#f0f6fc] rounded-full px-1.5 py-0.2 text-[10px] font-mono">
                {project.contributeIssues?.length || 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pulls')}
              className={tabItemClass('pulls')}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.5 5.396V4h3.25a.75.75 0 0 1 .75.75v5.372a2.25 2.25 0 1 1-1.5 0V5.5H9.5v1.396l-2.323-2.323a.75.75 0 0 1 0-1.06l2.323-2.323V2.5H12a2.25 2.25 0 0 1 2.25 2.25v5.372a2.25 2.25 0 1 1-1.5 0V4.75a.75.75 0 0 0-.75-.75H9.5V2.604Z" />
              </svg>
              <span>Pull requests (Roles)</span>
              <span className="bg-[#30363d] text-[#f0f6fc] rounded-full px-1.5 py-0.2 text-[10px] font-mono">
                {activeOpenRoles.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('discussions')}
              className={tabItemClass('discussions')}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v9.5C0 13.216.784 14 1.75 14H3v1.543a1.458 1.458 0 0 0 2.504.996L8.53 14H14.25A1.75 1.75 0 0 0 16 12.25v-9.5A1.75 1.75 0 0 0 14.25 1H1.75ZM1.5 2.75a.25.25 0 0 1 .25-.25h12.5a.25.25 0 0 1 .25.25v9.5a.25.25 0 0 1-.25.25H8.53a.75.75 0 0 0-.53.22L5 15.443V13.5a.75.75 0 0 0-.75-.75H1.75a.25.25 0 0 1-.25-.25Z" />
              </svg>
              <span>Discussions</span>
              <span className="bg-[#30363d] text-[#f0f6fc] rounded-full px-1.5 py-0.2 text-[10px] font-mono">
                {project.guidanceTopics?.length || 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sponsor')}
              className={tabItemClass('sponsor')}
            >
              <span className="text-[#ff7b72]">💖</span>
              <span>Milestones</span>
            </button>

          </div>

        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. REPOSITORY BODY CONTENT                                          */}
      {/* =================================================================== */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6">
        
        {/* TAB 1: CODE & REPOSITORY OVERVIEW */}
        {activeTab === 'code' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Repository Files, Commit Bar & README (8 of 12 cols) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Branch Selector + Code Clone Button Bar */}
              <div className="flex items-center justify-between gap-3 text-xs flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#3d444d] rounded-md font-semibold text-[#f0f6fc] shadow-xs"
                  >
                    <span>⑂</span>
                    <span>main</span>
                    <span className="text-[10px] text-[#9198a1]">▾</span>
                  </button>
                  <span className="text-[#9198a1] text-xs font-mono hidden sm:inline">1 Branch · 0 Tags</span>
                </div>

                <div className="flex items-center gap-2 relative">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#3d444d] rounded-md text-[#f0f6fc] font-semibold flex items-center gap-1"
                    >
                      <span>🌐 Live Demo</span>
                      <span>↗</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setCodeDropdownOpen(!codeDropdownOpen)}
                    className="px-3.5 py-1.5 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md shadow-xs flex items-center gap-1.5"
                  >
                    <span>&lt; &gt; Code</span>
                    <span className="text-[10px]">▾</span>
                  </button>

                  {codeDropdownOpen && (
                    <div
                      className="absolute right-0 top-full mt-1.5 w-72 bg-[#151b23] border border-[#3d444d] rounded-md shadow-xl p-3 z-50 text-xs"
                      onMouseLeave={() => setCodeDropdownOpen(false)}
                    >
                      <div className="font-bold text-[#f0f6fc] mb-2">Clone Repository</div>
                      <div className="flex items-center bg-[#010409] border border-[#3d444d] rounded px-2 py-1 text-[11px] font-mono text-[#9198a1] select-all">
                        git clone {project.githubUrl || 'https://github.com/DevSnapz/' + project.id}.git
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#3d444d] flex flex-col gap-1 text-[11px]">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#58a6ff] hover:underline"
                        >
                          Open in GitHub.com ↗
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Latest Commit Bar */}
              <div className="bg-[#151b23] border border-[#3d444d] rounded-md p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <img
                    src={project.creatorAvatar}
                    alt={project.creatorName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="font-semibold text-[#f0f6fc] truncate">
                    {project.creatorGithub || project.creatorName}
                  </span>
                  <span className="text-[#9198a1] truncate">
                    feat: initial release with skill-gap specifications
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-[#9198a1] whitespace-nowrap pl-2">
                  <span className="text-[#58a6ff] hover:underline">{project.id.slice(0, 7)}</span>
                  <span>3 hours ago</span>
                  <span className="hidden sm:inline">4 commits</span>
                </div>
              </div>

              {/* GitHub-style Security / Skill-Gap Detection Notice Banner */}
              <div className="bg-[#151b23] border border-[#3d444d] rounded-md p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#ff7b72] text-sm">⚡</span>
                    <h3 className="font-bold text-sm text-[#f0f6fc]">
                      DevSnapz Skill-Gap Detection Matrix
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-[rgba(248,81,73,0.15)] text-[#ff7b72] border border-[rgba(248,81,73,0.4)]">
                    {activeOpenRoles.length} Open Gaps Flagged
                  </span>
                </div>

                <p className="text-xs text-[#9198a1] leading-relaxed">
                  Automated architectural analysis of repository dependencies vs. required engineering competencies:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Known competencies */}
                  <div className="p-3 bg-[#010409] border border-[#3d444d] rounded-md">
                    <div className="text-xs font-bold text-[#79c0ff] flex items-center gap-1.5 mb-2">
                      <span>✓</span>
                      <span>Team Known Competencies ({knownSkills.length > 0 ? knownSkills.length : project.techStack.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(knownSkills.length > 0 ? knownSkills : project.techStack).map((s) => (
                        <span key={s} className="text-xs font-mono px-2 py-0.5 rounded bg-[rgba(56,139,253,0.15)] text-[#79c0ff] border border-[rgba(56,139,253,0.3)]">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing skill gaps */}
                  <div className="p-3 bg-[#010409] border border-[rgba(248,81,73,0.4)] rounded-md">
                    <div className="text-xs font-bold text-[#ff7b72] flex items-center gap-1.5 mb-2">
                      <span>⚡</span>
                      <span>Identified Skill Gaps ({allGapSkills.length})</span>
                    </div>
                    {allGapSkills.length === 0 ? (
                      <span className="text-xs text-[#9198a1]">No open gaps</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {allGapSkills.map((gap) => (
                          <span key={gap} className="text-xs font-mono px-2 py-0.5 rounded bg-[rgba(248,81,73,0.15)] text-[#ff7b72] border border-[rgba(248,81,73,0.4)]">
                            ⚡ Need: {gap}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab('pulls')}
                    className="text-xs font-semibold text-[#58a6ff] hover:underline flex items-center gap-1"
                  >
                    <span>View all collaboration roles and apply</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>

              {/* ============================================================= */}
              {/* README.MD BOX (GitHub-style Markdown View)                   */}
              {/* ============================================================= */}
              <div className="border border-[#3d444d] rounded-md bg-[#151b23] overflow-hidden">
                {/* Header */}
                <div className="bg-[#151b23] border-b border-[#3d444d] px-4 py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono font-semibold text-[#f0f6fc]">
                    <svg className="w-4 h-4 fill-current text-[#9198a1]" viewBox="0 0 16 16">
                      <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688Z" />
                    </svg>
                    <span>README.md</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#9198a1]">
                    <span>3.2 KB</span>
                  </div>
                </div>

                {/* Rendered README Body */}
                <div className="p-6 sm:p-8 space-y-6 text-sm text-[#f0f6fc] leading-relaxed">
                  
                  {/* Repo Heading */}
                  <div className="border-b border-[#3d444d] pb-4">
                    <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
                      <span>{project.icon || '🚀'}</span>
                      <span>{project.title}</span>
                    </h1>
                    <p className="text-base text-[#9198a1] mt-2 italic">
                      "{project.pitch}"
                    </p>
                  </div>

                  {/* Section 1: Overview */}
                  <div>
                    <h2 className="text-lg font-bold border-b border-[#3d444d] pb-2 mb-3">
                      About the Project
                    </h2>
                    <p className="text-sm text-[#9198a1] leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Section 2: Technical Architecture */}
                  <div>
                    <h2 className="text-lg font-bold border-b border-[#3d444d] pb-2 mb-3">
                      Tech Stack & Ecosystem
                    </h2>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.techStack.map((t) => (
                        <span key={t} className="px-2.5 py-1 bg-[#21262d] border border-[#3d444d] rounded-md font-mono text-xs text-[#58a6ff]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Open Collaboration Roles */}
                  <div>
                    <h2 className="text-lg font-bold border-b border-[#3d444d] pb-2 mb-3">
                      Open Roles & Team Growth
                    </h2>
                    {openRolesList.length === 0 ? (
                      <p className="text-xs text-[#9198a1]">No open roles currently listed.</p>
                    ) : (
                      <div className="space-y-3">
                        {openRolesList.map((role) => (
                          <div
                            key={role.id}
                            className="p-4 bg-[#010409] border border-[#3d444d] rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div>
                              <div className="font-bold text-sm text-[#f0f6fc] flex items-center gap-2">
                                <span>{role.roleName}</span>
                                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[rgba(56,139,253,0.15)] text-[#79c0ff] border border-[rgba(56,139,253,0.3)]">
                                  {role.status}
                                </span>
                              </div>
                              <p className="text-xs text-[#9198a1] mt-1">{role.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {role.skillsNeeded.map((s) => (
                                  <span key={s} className="text-xs font-mono px-1.5 py-0.2 rounded bg-[#21262d] text-[#ff7b72] border border-[#3d444d]">
                                    ⚡ {s}
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
                                  setActiveTab('pulls');
                                }}
                                className="px-3.5 py-1.5 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md text-xs shadow-xs whitespace-nowrap self-start sm:self-auto"
                              >
                                Apply ➔
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>

            </div>

            {/* Right Column: GitHub Repository Sidebar "About" (4 of 12 cols) */}
            <div className="lg:col-span-4 space-y-6 text-xs text-[#f0f6fc]">
              
              {/* About Block */}
              <div className="space-y-3 pb-5 border-b border-[#3d444d]">
                <h3 className="font-bold text-sm text-[#f0f6fc]">About</h3>
                <p className="text-[#9198a1] leading-relaxed">
                  {project.pitch}
                </p>

                {project.liveUrl && (
                  <div className="flex items-center gap-2 text-[#58a6ff]">
                    <span>🔗</span>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold hover:underline truncate"
                    >
                      {project.liveUrl}
                    </a>
                  </div>
                )}

                {/* Topics pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 rounded-full bg-[rgba(56,139,253,0.15)] text-[#58a6ff] hover:bg-[#1f6feb] hover:text-white transition-colors cursor-pointer text-[11px] font-semibold"
                    >
                      {tech.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-[#9198a1] pt-2">
                  <span>📖 Readme</span>
                </div>
                <div className="flex items-center gap-2 text-[#9198a1]">
                  <span>⭐ {starCount} stars</span>
                </div>
                <div className="flex items-center gap-2 text-[#9198a1]">
                  <span>👁️ 6 watching</span>
                </div>
                <div className="flex items-center gap-2 text-[#9198a1]">
                  <span>⑂ 4 forks</span>
                </div>
              </div>

              {/* Releases */}
              <div className="space-y-2 pb-5 border-b border-[#3d444d]">
                <h3 className="font-bold text-sm text-[#f0f6fc]">Releases</h3>
                <div className="flex items-center gap-2 text-[#79c0ff]">
                  <span className="font-mono text-xs font-semibold">v1.0.0</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[rgba(56,139,253,0.15)] text-[10px] font-bold">Latest</span>
                </div>
                <p className="text-[#9198a1] text-[11px]">Published initial student build</p>
              </div>

              {/* Contributors */}
              <div className="space-y-3 pb-5 border-b border-[#3d444d]">
                <h3 className="font-bold text-sm text-[#f0f6fc]">Contributors</h3>
                <div className="flex items-center gap-2">
                  <img
                    src={project.creatorAvatar}
                    alt={project.creatorName}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-[#3d444d]"
                    title={project.creatorName}
                  />
                  <div>
                    <div className="font-bold text-xs">{project.creatorName}</div>
                    <div className="text-[11px] font-mono text-[#9198a1]">Project Lead</div>
                  </div>
                </div>
              </div>

              {/* Languages Bar */}
              <div className="space-y-2.5">
                <h3 className="font-bold text-sm text-[#f0f6fc]">Languages</h3>
                
                {/* Languages Colored Bar */}
                <div className="w-full h-2 rounded-full overflow-hidden flex bg-[#21262d]">
                  <div className="bg-[#3178c6] h-full" style={{ width: '65%' }} title="TypeScript 65%" />
                  <div className="bg-[#ff7b72] h-full" style={{ width: '25%' }} title="HTML/CSS 25%" />
                  <div className="bg-[#79c0ff] h-full" style={{ width: '10%' }} title="Other 10%" />
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#9198a1]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#3178c6]" />
                    <strong className="text-[#f0f6fc]">TypeScript</strong> 65.0%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#ff7b72]" />
                    <strong className="text-[#f0f6fc]">HTML/CSS</strong> 25.0%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#79c0ff]" />
                    <strong className="text-[#f0f6fc]">Shell</strong> 10.0%
                  </span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: SKILL GAPS & ROLE APPLICATION */}
        {activeTab === 'gaps' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="border border-[#3d444d] rounded-md bg-[#151b23] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#3d444d]">
                <div>
                  <h2 className="font-bold text-base text-[#f0f6fc]">Skill Gaps & Engineering Roles</h2>
                  <p className="text-xs text-[#9198a1] mt-0.5">Explore open requirements and join the core developer team.</p>
                </div>
                <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-[rgba(248,81,73,0.15)] text-[#ff7b72] border border-[rgba(248,81,73,0.4)] rounded-md">
                  {activeOpenRoles.length} Open Roles
                </span>
              </div>

              <div className="space-y-4">
                {openRolesList.map((role) => (
                  <div key={role.id} className="p-4 bg-[#010409] border border-[#3d444d] rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#f0f6fc]">{role.roleName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[rgba(56,139,253,0.15)] text-[#79c0ff] border border-[rgba(56,139,253,0.3)]">
                          {role.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#9198a1] mt-1">{role.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {role.skillsNeeded.map((s) => (
                          <span key={s} className="text-xs font-mono px-2 py-0.5 rounded bg-[rgba(248,81,73,0.15)] text-[#ff7b72] border border-[rgba(248,81,73,0.4)]">
                            ⚡ {s}
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
                          setActiveTab('pulls');
                        }}
                        className="px-4 py-1.5 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md text-xs shadow-xs"
                      >
                        Apply for Role ➔
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ISSUES (Claimable starter engineering tasks) */}
        {activeTab === 'issues' && (
          <div className="space-y-4">
            
            {/* GitHub Issues Controls Header */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-grow max-w-md">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="is:issue is:open "
                    className="w-full bg-[#151b23] border border-[#3d444d] rounded-md px-3 py-1.5 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
                    readOnly
                  />
                </div>
              </div>
              <span className="text-xs text-[#9198a1]">
                {project.contributeIssues?.length || 0} Open Starter Tasks
              </span>
            </div>

            {/* GitHub Issues Table Box */}
            <div className="border border-[#3d444d] rounded-md bg-[#151b23] overflow-hidden">
              <div className="bg-[#151b23] border-b border-[#3d444d] px-4 py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 font-semibold text-[#f0f6fc]">
                  <span className="flex items-center gap-1.5 text-[#79c0ff]">
                    <span>⊙</span>
                    <span>{project.contributeIssues?.length || 0} Open</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[#9198a1]">
                    <span>✓</span>
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
                      className="p-3.5 hover:bg-[#21262d]/50 transition-colors flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-[#79c0ff] mt-0.5">⊙</span>
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
                          <div className="text-[11px] text-[#9198a1] mt-1">
                            #{idx + 1} opened 2 days ago by @{project.creatorGithub || project.creatorName}
                          </div>
                        </div>
                      </div>

                      <div>
                        {issue.status === 'open' && (
                          <button
                            type="button"
                            onClick={() => onClaimIssue(project.id, issue.id)}
                            className="px-3 py-1 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md shadow-xs text-xs whitespace-nowrap"
                          >
                            Claim Task
                          </button>
                        )}
                        {issue.status === 'claimed' && (
                          <span className="px-2.5 py-1 rounded bg-[#21262d] border border-[#3d444d] text-[#ff7b72] font-semibold text-xs">
                            Claimed
                          </span>
                        )}
                        {issue.status === 'merged' && (
                          <span className="px-2.5 py-1 rounded bg-[#21262d] border border-[#3d444d] text-[#79c0ff] font-semibold text-xs">
                            Resolved
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

        {/* TAB 4: PULL REQUESTS & COLLABORATOR APPLICATIONS */}
        {activeTab === 'pulls' && (
          <div className="space-y-6">
            
            {/* Embedded Application Modal if a role is selected */}
            {selectedRole && (
              <div className="border border-[#1f6feb] rounded-md bg-[#151b23] p-6 shadow-xl animate-fade-in mb-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#3d444d] mb-4">
                  <div>
                    <h3 className="font-bold text-base text-[#f0f6fc]">
                      Submit Pull Request for: <span className="text-[#58a6ff]">{selectedRole.roleName}</span>
                    </h3>
                    <p className="text-xs text-[#9198a1] mt-0.5">Pitch your competencies to merge into the repository team.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedRole(null)}
                    className="text-[#9198a1] hover:text-[#f0f6fc] text-lg font-bold"
                  >
                    ×
                  </button>
                </div>

                {applicationSuccess ? (
                  <div className="p-4 bg-[rgba(56,139,253,0.15)] border border-[rgba(56,139,253,0.4)] rounded-md text-center text-xs text-[#79c0ff] font-semibold">
                    🎉 Collaboration request submitted! The repository maintainer has been notified.
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
                        <label className="block text-[#9198a1] uppercase font-mono text-[11px] mb-1">GitHub / Discord / Email</label>
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
                      <label className="block text-[#9198a1] uppercase font-mono text-[11px] mb-1">Matching Skills</label>
                      <input
                        type="text"
                        required
                        value={applicantSkills}
                        onChange={(e) => setApplicantSkills(e.target.value)}
                        className="w-full px-3 py-2 bg-[#010409] border border-[#3d444d] rounded-md text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#9198a1] uppercase font-mono text-[11px] mb-1">Cover Note / Pitch</label>
                      <textarea
                        rows={3}
                        required
                        value={applicantMessage}
                        onChange={(e) => setApplicantMessage(e.target.value)}
                        placeholder="Why do you want to collaborate on this repository? What PRs can you ship?"
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
                        Create Pull Request ➔
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* List of Open Roles as Pull Request Slots */}
            <div className="border border-[#3d444d] rounded-md bg-[#151b23] overflow-hidden">
              <div className="bg-[#151b23] border-b border-[#3d444d] px-4 py-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#f0f6fc] flex items-center gap-1.5">
                  <span className="text-[#79c0ff]">⑂</span>
                  <span>{activeOpenRoles.length} Open Roles Ready for Contributors</span>
                </span>
              </div>

              <div className="divide-y divide-[#3d444d]">
                {openRolesList.map((role) => (
                  <div key={role.id} className="p-4 hover:bg-[#21262d]/50 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#79c0ff]">⑂</span>
                        <span className="font-bold text-sm text-[#f0f6fc]">{role.roleName}</span>
                        <span className="px-2 py-0.2 rounded-full bg-[rgba(56,139,253,0.15)] text-[#79c0ff] border border-[rgba(56,139,253,0.3)] text-[10px] font-mono">
                          {role.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#9198a1] mt-1">{role.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {role.skillsNeeded.map((s) => (
                          <span key={s} className="text-xs font-mono px-2 py-0.5 rounded bg-[rgba(248,81,73,0.15)] text-[#ff7b72] border border-[rgba(248,81,73,0.4)]">
                            ⚡ {s}
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
                        className="px-3.5 py-1.5 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md shadow-xs whitespace-nowrap"
                      >
                        Apply to Role ➔
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: DISCUSSIONS (Architecture Q&A) */}
        {activeTab === 'discussions' && (
          <div className="space-y-6">
            
            {/* Ask Question Box */}
            <form onSubmit={handleAddQuestionSubmit} className="border border-[#3d444d] rounded-md bg-[#151b23] p-4 flex gap-3 text-xs">
              <input
                type="text"
                placeholder="Ask a technical architecture or system design question..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="flex-grow bg-[#010409] border border-[#3d444d] rounded-md px-3 py-2 text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md shadow-xs whitespace-nowrap"
              >
                Start Discussion
              </button>
            </form>

            {/* Discussions Thread List */}
            <div className="space-y-4">
              {(project.guidanceTopics || []).length === 0 ? (
                <div className="border border-[#3d444d] rounded-md bg-[#151b23] p-8 text-center text-xs text-[#9198a1]">
                  No discussions started yet. Ask the first engineering question!
                </div>
              ) : (
                project.guidanceTopics?.map((topic) => (
                  <div key={topic.id} className="border border-[#3d444d] rounded-md bg-[#151b23] p-5 space-y-4 text-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[#58a6ff] text-base">💬</span>
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
                                  Author
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

        {/* TAB 6: SPONSOR & MILESTONES */}
        {activeTab === 'sponsor' && (
          <div className="max-w-2xl mx-auto space-y-6 text-xs">
            
            {/* Funding Goal Bar */}
            {project.fundingGoal && (
              <div className="border border-[#3d444d] rounded-md bg-[#151b23] p-5 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#f0f6fc]">
                    Infrastructure Funding: ${project.fundingRaised || 0} raised
                  </span>
                  <span className="text-[#9198a1]">Target: ${project.fundingGoal}</span>
                </div>
                <div className="w-full bg-[#010409] h-2 rounded-full overflow-hidden border border-[#3d444d]">
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
                  className={`p-4 rounded-md border cursor-pointer transition-colors ${
                    selectedTier?.id === tier.id
                      ? 'border-[#ff7b72] bg-[rgba(248,81,73,0.15)] ring-1 ring-[#ff7b72]'
                      : 'border-[#3d444d] bg-[#151b23] hover:border-[#656c76]'
                  }`}
                >
                  <div className="font-bold text-sm text-[#f0f6fc]">{tier.name}</div>
                  <div className="text-xl font-extrabold text-[#ff7b72] mt-1">${tier.amount}</div>
                  <p className="text-[#9198a1] mt-2">{tier.benefits}</p>
                </div>
              ))}
            </div>

            {/* Sponsor form */}
            <form onSubmit={handleSponsorSubmit} className="border border-[#3d444d] rounded-md bg-[#151b23] p-5 space-y-4">
              <h4 className="font-bold text-sm text-[#f0f6fc]">Sponsor this Project</h4>
              {sponsorSuccess ? (
                <div className="p-3 bg-[rgba(56,139,253,0.15)] text-[#79c0ff] rounded-md font-semibold text-center">
                  Thank you! Your sponsorship has been recorded.
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
                    className="w-full py-2 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md shadow-xs"
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
