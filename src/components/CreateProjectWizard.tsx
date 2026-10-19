import React, { useState } from 'react';
import { Project, OpenRole, ContributeIssue } from '../types';

interface CreateProjectWizardProps {
  onClose: () => void;
  onSubmit: (project: Project) => void;
}

const gradientOptions = [
  { label: 'Indigo Galaxy', value: 'from-indigo-600 via-purple-600 to-pink-600' },
  { label: 'Emerald Eco', value: 'from-emerald-600 via-teal-600 to-cyan-600' },
  { label: 'Cyber Violet', value: 'from-blue-600 via-indigo-600 to-violet-700' },
  { label: 'Sunset Coral', value: 'from-amber-500 via-rose-500 to-red-600' },
  { label: 'Teal Forest', value: 'from-teal-600 via-emerald-600 to-green-700' },
  { label: 'Midnight Slate', value: 'from-slate-700 via-zinc-800 to-neutral-900' },
];

export default function CreateProjectWizard({ onClose, onSubmit }: CreateProjectWizardProps) {
  const [step, setStep] = useState(1);

  // Step 1: Basic Info
  const [title, setTitle] = useState('');
  const [pitch, setPitch] = useState('');
  const [description, setDescription] = useState('');
  const [creatorName, setCreatorName] = useState('Frozen');
  const [creatorAvatar, setCreatorAvatar] = useState('https://avatars.githubusercontent.com/u/174297688?s=96&v=4');
  const [creatorGithub, setCreatorGithub] = useState('Frozen-47');

  // Step 2: Tech & Links
  const [techInput, setTechInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [bannerGradient, setBannerGradient] = useState(gradientOptions[0].value);

  // Step 3: Help Toggles
  const [helpNeeded, setHelpNeeded] = useState({
    sponsor: false,
    collaborate: true,
    guide: false,
    contribute: false,
  });

  // Step 3 sub-fields: Sponsor
  const [fundingGoal, setFundingGoal] = useState('');

  // Step 3 sub-fields: Collaborate roles list
  const [rolesList, setRolesList] = useState<OpenRole[]>([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleSkills, setNewRoleSkills] = useState('');

  // Step 3 sub-fields: Guidance
  const [initialQuestion, setInitialQuestion] = useState('');

  // Step 3 sub-fields: Contribute issues list
  const [issuesList, setIssuesList] = useState<ContributeIssue[]>([]);
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueDifficulty, setNewIssueDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  const addRole = () => {
    if (!newRoleName.trim()) return;
    const newRole: OpenRole = {
      id: `role-${Date.now()}`,
      roleName: newRoleName,
      description: newRoleDesc,
      skillsNeeded: newRoleSkills.split(',').map((s) => s.trim()).filter((s) => s),
      status: 'open',
    };
    setRolesList([...rolesList, newRole]);
    setNewRoleName('');
    setNewRoleDesc('');
    setNewRoleSkills('');
  };

  const removeRole = (id: string) => {
    setRolesList(rolesList.filter((r) => r.id !== id));
  };

  const addIssue = () => {
    if (!newIssueTitle.trim()) return;
    const count = issuesList.length + 1;
    const newIssue: ContributeIssue = {
      id: `issue-${count}`,
      title: newIssueTitle,
      difficulty: newIssueDifficulty,
      link: githubUrl ? `${githubUrl}/issues/${count}` : '#',
      status: 'open',
    };
    setIssuesList([...issuesList, newIssue]);
    setNewIssueTitle('');
  };

  const removeIssue = (id: string) => {
    setIssuesList(issuesList.filter((i) => i.id !== id));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const techStack = techInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    const newProject: Project = {
      id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title,
      pitch,
      description,
      creatorName,
      creatorAvatar,
      creatorGithub: creatorGithub || undefined,
      bannerGradient,
      techStack: techStack.length > 0 ? techStack : ['React', 'TypeScript'],
      githubUrl: githubUrl || 'https://github.com',
      liveUrl: liveUrl || undefined,
      fundingGoal: helpNeeded.sponsor && fundingGoal ? parseFloat(fundingGoal) : undefined,
      fundingRaised: helpNeeded.sponsor ? 0 : undefined,
      helpNeeded,
      openRoles: helpNeeded.collaborate ? rolesList : [],
      sponsorshipTiers: helpNeeded.sponsor
        ? [
            { id: 't-1', name: 'Student Coffee Sponsor', amount: 5, benefits: 'Name in README' },
            { id: 't-2', name: 'Server Supporter', amount: 25, benefits: 'Featured spot in about dashboard' },
          ]
        : [],
      sponsorsList: [],
      guidanceTopics: helpNeeded.guide && initialQuestion
        ? [
            {
              id: `g-${Date.now()}`,
              question: initialQuestion,
              askedBy: creatorName,
              askedAt: new Date().toISOString(),
              replies: [],
            },
          ]
        : [],
      contributeIssues: helpNeeded.contribute ? issuesList : [],
    };

    onSubmit(newProject);
  };

  const nextStep = () => {
    if (step === 1 && (!title.trim() || !pitch.trim() || !description.trim())) {
      alert('Please fill out title, pitch, and description');
      return;
    }
    if (step === 2 && !techInput.trim()) {
      alert('Please input at least one tech stack tag');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/40 backdrop-blur-xs transition-all duration-300">
      <div className="relative w-full max-w-2xl bg-white border border-[#E5E7EB] rounded-2xl shadow-xl overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-[#E5E7EB] flex justify-between items-center">
          <div>
            <h2 className="font-extrabold text-lg text-[#111827]">Publish Project Idea</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">Define your build, highlight skill gaps, and recruit teammates</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#111827] text-lg font-semibold w-8 h-8 rounded-xl border border-[#E5E7EB] hover:border-[#635BFF]/30 hover:bg-[#F7F8FC] flex items-center justify-center transition-all duration-200"
          >
            ×
          </button>
        </div>

        {/* Stepper progress bar */}
        <div className="px-6 py-3.5 bg-[#F7F8FC] flex items-center justify-between text-xs font-sans text-[#6B7280] border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[0.68rem] border ${step >= 1 ? 'border-[#635BFF] text-white bg-[#635BFF]' : 'border-[#E5E7EB] text-[#9CA3AF] bg-white'}`}>1</span>
            <span className={step >= 1 ? 'text-[#111827] font-semibold' : ''}>Overview</span>
          </div>
          <div className="flex-grow h-[1px] bg-[#E5E7EB] mx-3" />
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[0.68rem] border ${step >= 2 ? 'border-[#635BFF] text-white bg-[#635BFF]' : 'border-[#E5E7EB] text-[#9CA3AF] bg-white'}`}>2</span>
            <span className={step >= 2 ? 'text-[#111827] font-semibold' : ''}>Stack & Links</span>
          </div>
          <div className="flex-grow h-[1px] bg-[#E5E7EB] mx-3" />
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[0.68rem] border ${step >= 3 ? 'border-[#635BFF] text-white bg-[#635BFF]' : 'border-[#E5E7EB] text-[#9CA3AF] bg-white'}`}>3</span>
            <span className={step >= 3 ? 'text-[#111827] font-semibold' : ''}>Roles & Skill Gaps</span>
          </div>
        </div>

        {/* Scrollable form content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] min-h-[350px]">
          
          {/* STEP 1: GENERAL DETAILS */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#6B7280] mb-1 font-semibold">Project Title <span className="text-[#F9735B]">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Campus Recycling App"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F7F8FC] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#6B7280] mb-1 font-semibold">One-sentence Pitch <span className="text-[#F9735B]">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build a smarter recycling experience for college campuses."
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  className="w-full bg-[#F7F8FC] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#6B7280] mb-1 font-semibold">Detailed Description <span className="text-[#F9735B]">*</span></label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain the problem statement, technical architecture, and development roadmap..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#F7F8FC] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/20 transition-all resize-none leading-relaxed"
                />
              </div>

              <div className="bg-[#F7F8FC] border border-[#E5E7EB] p-4 rounded-xl space-y-4">
                <div className="text-[0.68rem] font-mono uppercase text-[#9CA3AF] tracking-wider font-semibold">Creator Information</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#6B7280] mb-1 font-semibold">Display Name</label>
                    <input
                      type="text"
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#635BFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#6B7280] mb-1 font-semibold">Github Username</label>
                    <input
                      type="text"
                      placeholder="e.g. Frozen-47"
                      value={creatorGithub}
                      onChange={(e) => setCreatorGithub(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#635BFF]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TECH & ASSETS */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#6B7280] mb-1 font-semibold">Technical Stack (comma separated) <span className="text-[#F9735B]">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React, PostgreSQL, Tailwind CSS"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="w-full bg-[#F7F8FC] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#635BFF]"
                />
                <span className="text-[0.68rem] text-[#9CA3AF] mt-1 block font-mono">Separate entries with commas</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#6B7280] mb-1 font-semibold">GitHub Repository URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/DevSnapz/example"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full bg-[#F7F8FC] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#635BFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#6B7280] mb-1 font-semibold">Live Demo / App URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://example.devsnapz.org"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="w-full bg-[#F7F8FC] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#635BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#6B7280] mb-2 font-semibold">Accent Banner Gradient</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {gradientOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setBannerGradient(opt.value)}
                      className={`text-left p-3 rounded-xl border flex flex-col justify-between transition-all ${
                        bannerGradient === opt.value
                          ? 'border-[#635BFF] bg-[#F3F1FF]/50 shadow-xs ring-1 ring-[#635BFF]'
                          : 'border-[#E5E7EB] hover:border-[#635BFF]/30 bg-white'
                      }`}
                    >
                      <span className="text-xs font-semibold text-[#111827] mb-2">{opt.label}</span>
                      <div className={`w-full h-3 rounded-lg bg-gradient-to-r ${opt.value}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: HELP OPTIONS */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-[#E5E7EB] pb-2.5">
                <h3 className="text-xs font-mono uppercase text-[#6B7280] tracking-wider mb-1 font-semibold">Identify Collaboration & Missing Skills</h3>
                <p className="text-xs text-[#6B7280]">Toggle categories to configure required team roles and tasks.</p>
              </div>

              {/* Toggles Panel */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['collaborate', 'sponsor', 'guide', 'contribute'] as const).map((key) => {
                  const isActive = helpNeeded[key];
                  const labels: Record<string, string> = {
                    collaborate: 'Collaborators',
                    sponsor: 'Sponsors',
                    guide: 'Mentorship',
                    contribute: 'Issues',
                  };
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setHelpNeeded({ ...helpNeeded, [key]: !helpNeeded[key] })}
                      className={`py-2 px-3 text-xs font-sans rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                        isActive
                          ? 'bg-[#F3F1FF] border-[#635BFF] text-[#635BFF] font-semibold shadow-xs'
                          : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FC]'
                      }`}
                    >
                      <span>{isActive ? '✓' : '+'}</span>
                      <span>{labels[key]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Toggle Content Forms */}
              <div className="space-y-4">
                
                {/* 1. Collaborate Sub-form */}
                {helpNeeded.collaborate && (
                  <div className="bg-[#F7F8FC] border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex justify-between items-center text-xs border-b border-[#E5E7EB] pb-2 font-mono text-[#635BFF]">
                      <span className="font-semibold uppercase">Open Roles & Missing Skill Requirements</span>
                      <span className="font-sans font-semibold">{rolesList.length} Role(s) Added</span>
                    </div>

                    {/* Roles Added List */}
                    {rolesList.length > 0 && (
                      <div className="space-y-2">
                        {rolesList.map((role) => (
                          <div key={role.id} className="bg-white border border-[#E5E7EB] p-3 rounded-xl flex justify-between items-start text-xs shadow-xs">
                            <div>
                              <div className="font-bold text-[#111827]">{role.roleName}</div>
                              {role.description && <p className="text-[#6B7280] text-xs mt-0.5">{role.description}</p>}
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {role.skillsNeeded.map((s) => (
                                  <span key={s} className="text-xs font-mono bg-[#F3F1FF] border border-[#635BFF]/25 px-1.5 py-0.2 rounded text-[#635BFF]">{s}</span>
                                ))}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeRole(role.id)}
                              className="text-rose-500 hover:text-rose-600 font-sans text-xs ml-2 font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add role inputs */}
                    <div className="bg-white border border-[#E5E7EB] p-3.5 rounded-xl space-y-3 shadow-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-mono uppercase text-[#6B7280] mb-1 font-semibold">Role Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Frontend Developer"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            className="w-full bg-[#F7F8FC] border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#635BFF]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase text-[#6B7280] mb-1 font-semibold">Required Skills (comma separated)</label>
                          <input
                            type="text"
                            placeholder="e.g. React, TypeScript"
                            value={newRoleSkills}
                            onChange={(e) => setNewRoleSkills(e.target.value)}
                            className="w-full bg-[#F7F8FC] border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#635BFF]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#6B7280] mb-1 font-semibold">Description of duties</label>
                        <input
                          type="text"
                          placeholder="e.g. Help build out reactive client views and filters"
                          value={newRoleDesc}
                          onChange={(e) => setNewRoleDesc(e.target.value)}
                          className="w-full bg-[#F7F8FC] border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#635BFF]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addRole}
                        className="bg-[#635BFF] hover:bg-[#5246C9] text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg active:scale-95 transition-all shadow-xs"
                      >
                        + Add Role to Requirements
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Sponsor Sub-form */}
                {helpNeeded.sponsor && (
                  <div className="bg-[#F7F8FC] border border-[#E5E7EB] rounded-2xl p-4 space-y-3">
                    <div className="text-xs border-b border-[#E5E7EB] pb-2 font-mono font-semibold text-[#111827]">
                      Sponsorship Milestones
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#6B7280] mb-1 font-semibold">Funding Goal Target Amount ($)</label>
                      <div className="relative max-w-[200px]">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-[#9CA3AF]">$</span>
                        <input
                          type="number"
                          placeholder="e.g. 1000"
                          value={fundingGoal}
                          onChange={(e) => setFundingGoal(e.target.value)}
                          className="w-full pl-7 pr-3 py-1.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#635BFF]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Guidance Sub-form */}
                {helpNeeded.guide && (
                  <div className="bg-[#F7F8FC] border border-[#E5E7EB] rounded-2xl p-4 space-y-3">
                    <div className="text-xs border-b border-[#E5E7EB] pb-2 font-mono font-semibold text-[#635BFF]">
                      Post an Initial Mentorship Topic
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#6B7280] mb-1 font-semibold">What technical architecture question do you need guidance on?</label>
                      <input
                        type="text"
                        placeholder="e.g. What is the optimal database schema for campus recycling routes?"
                        value={initialQuestion}
                        onChange={(e) => setInitialQuestion(e.target.value)}
                        className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#635BFF]"
                      />
                    </div>
                  </div>
                )}

                {/* 4. Contribute Sub-form */}
                {helpNeeded.contribute && (
                  <div className="bg-[#F7F8FC] border border-[#E5E7EB] rounded-2xl p-4 space-y-4">
                    <div className="flex justify-between items-center text-xs border-b border-[#E5E7EB] pb-2 font-mono font-semibold text-[#17936C]">
                      <span>Starter Tasks & Issues</span>
                      <span className="font-sans font-semibold">{issuesList.length} Issue(s) Added</span>
                    </div>

                    {/* Issues Added List */}
                    {issuesList.length > 0 && (
                      <div className="space-y-2">
                        {issuesList.map((issue) => (
                          <div key={issue.id} className="bg-white border border-[#E5E7EB] p-2.5 rounded-xl flex justify-between items-center text-xs shadow-xs">
                            <div>
                              <span className="font-bold text-[#111827]">{issue.title}</span>
                              <span className="text-[0.62rem] ml-2 font-mono uppercase px-2 py-0.5 rounded-full bg-[#F7F8FC] border border-[#E5E7EB] text-[#6B7280] font-semibold">{issue.difficulty}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeIssue(issue.id)}
                              className="text-rose-500 hover:text-rose-600 font-sans text-xs ml-2 font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add issue inputs */}
                    <div className="bg-white border border-[#E5E7EB] p-3 rounded-xl flex flex-col sm:flex-row gap-3 items-end shadow-xs">
                      <div className="flex-grow">
                        <label className="block text-xs font-mono uppercase text-[#6B7280] mb-1 font-semibold">Issue Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Add dark mode toggle in nav"
                          value={newIssueTitle}
                          onChange={(e) => setNewIssueTitle(e.target.value)}
                          className="w-full bg-[#F7F8FC] border border-[#E5E7EB] rounded-lg px-2.5 py-1 text-xs text-[#111827] focus:outline-none focus:border-[#635BFF]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#6B7280] mb-1 font-semibold">Difficulty</label>
                        <select
                          value={newIssueDifficulty}
                          onChange={(e) => setNewIssueDifficulty(e.target.value as any)}
                          className="bg-[#F7F8FC] border border-[#E5E7EB] rounded-lg px-2 py-1 text-xs text-[#111827] focus:outline-none min-w-[100px]"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={addIssue}
                        className="bg-[#17936C] hover:bg-[#137a59] text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg active:scale-95 transition-all shadow-xs"
                      >
                        + Add Task
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Wizard Nav Actions */}
        <div className="p-4 bg-white border-t border-[#E5E7EB] flex justify-between items-center text-xs font-sans">
          <button
            type="button"
            onClick={step === 1 ? onClose : prevStep}
            className="text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB] hover:bg-[#F7F8FC] rounded-xl px-4 py-2 transition-all font-medium"
          >
            {step === 1 ? 'Cancel' : '← Back'}
          </button>
          
          <button
            type="button"
            onClick={step === 3 ? handleFinalSubmit : nextStep}
            className="bg-[#635BFF] hover:bg-[#5246C9] text-white font-semibold rounded-xl px-5 py-2 shadow-xs active:scale-95 transition-all"
          >
            {step === 3 ? 'Publish Project Idea ➔' : 'Continue ➔'}
          </button>
        </div>

      </div>
    </div>
  );
}
