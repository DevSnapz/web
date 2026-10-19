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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/75 backdrop-blur-md transition-all duration-300">
      <div className="relative w-full max-w-2xl bg-[#151B2D] border border-[#222F4C] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="bg-[#0B1020]/90 px-6 py-4 border-b border-[#222F4C] flex justify-between items-center">
          <div>
            <h2 className="font-extrabold text-lg text-white">Publish Project Idea</h2>
            <p className="text-xs text-slate-300 mt-0.5">Define your build, highlight skill gaps, and recruit teammates</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-semibold w-8 h-8 rounded-xl border border-[#222F4C] hover:border-slate-500 flex items-center justify-center transition-all duration-200"
          >
            ×
          </button>
        </div>

        {/* Stepper progress bar */}
        <div className="px-6 py-3.5 bg-[#0B1020]/40 flex items-center justify-between text-xs font-mono text-slate-400 border-b border-[#222F4C]">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[0.68rem] border ${step >= 1 ? 'border-[#635BFF] text-white bg-[#635BFF]' : 'border-[#222F4C] text-slate-500'}`}>1</span>
            <span className={step >= 1 ? 'text-white font-medium' : ''}>Overview</span>
          </div>
          <div className="flex-grow h-[1px] bg-[#222F4C] mx-3" />
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[0.68rem] border ${step >= 2 ? 'border-[#635BFF] text-white bg-[#635BFF]' : 'border-[#222F4C] text-slate-500'}`}>2</span>
            <span className={step >= 2 ? 'text-white font-medium' : ''}>Stack & Links</span>
          </div>
          <div className="flex-grow h-[1px] bg-[#222F4C] mx-3" />
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[0.68rem] border ${step >= 3 ? 'border-[#635BFF] text-white bg-[#635BFF]' : 'border-[#222F4C] text-slate-500'}`}>3</span>
            <span className={step >= 3 ? 'text-white font-medium' : ''}>Roles & Skill Gaps</span>
          </div>
        </div>

        {/* Scrollable form content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] min-h-[350px]">
          
          {/* STEP 1: GENERAL DETAILS */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Project Title <span className="text-[#F9735B]">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EcoLedger"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0B1020] border border-[#222F4C] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#635BFF] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">One-sentence Pitch <span className="text-[#F9735B]">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed solar telemetry network for campus dormitories."
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  className="w-full bg-[#0B1020] border border-[#222F4C] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#635BFF] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Detailed Description <span className="text-[#F9735B]">*</span></label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain the problem statement, technical architecture, and development roadmap..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0B1020] border border-[#222F4C] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#635BFF] transition-all resize-none leading-relaxed"
                />
              </div>

              <div className="bg-[#0B1020]/70 border border-[#222F4C] p-4 rounded-xl space-y-4">
                <div className="text-[0.65rem] font-mono uppercase text-slate-400 tracking-wider">Creator Information</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.65rem] font-mono uppercase text-slate-400 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      className="w-full bg-[#151B2D] border border-[#222F4C] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-mono uppercase text-slate-400 mb-1">Github Username</label>
                    <input
                      type="text"
                      placeholder="e.g. Frozen-47"
                      value={creatorGithub}
                      onChange={(e) => setCreatorGithub(e.target.value)}
                      className="w-full bg-[#151B2D] border border-[#222F4C] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#635BFF]"
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
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Technical Stack (comma separated) <span className="text-[#F9735B]">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React, TypeScript, Python, PyTorch, Docker"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="w-full bg-[#0B1020] border border-[#222F4C] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                />
                <span className="text-[0.65rem] text-slate-500 mt-1 block font-mono">Separate entries with commas</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">GitHub Repository URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/user/project"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full bg-[#0B1020] border border-[#222F4C] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Live Demo / App URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://project.devsnapz.org"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="w-full bg-[#0B1020] border border-[#222F4C] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Accent Banner Gradient</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {gradientOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setBannerGradient(opt.value)}
                      className={`text-left p-3 rounded-xl border flex flex-col justify-between transition-all ${
                        bannerGradient === opt.value
                          ? 'border-[#635BFF] bg-[#635BFF]/10 shadow-md shadow-[#635BFF]/10 ring-1 ring-[#635BFF]'
                          : 'border-[#222F4C] hover:border-slate-500 bg-[#0B1020]/60'
                      }`}
                    >
                      <span className="text-xs font-medium text-white mb-2">{opt.label}</span>
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
              <div className="border-b border-[#222F4C] pb-2.5">
                <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-1">Identify Collaboration & Missing Skills</h3>
                <p className="text-xs text-slate-300">Toggle categories to configure required team roles and tasks.</p>
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
                      className={`py-2 px-3 text-xs font-mono rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                        isActive
                          ? 'bg-[#635BFF] border-[#635BFF] text-white font-bold shadow-md shadow-[#635BFF]/20'
                          : 'bg-[#0B1020]/60 border-[#222F4C] text-slate-400 hover:text-white hover:border-slate-500'
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
                  <div className="bg-[#0B1020]/70 border border-[#222F4C] rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex justify-between items-center text-xs border-b border-[#222F4C] pb-2 font-mono text-[#9D98FF]">
                      <span className="font-semibold uppercase">Open Roles & Missing Skill Requirements</span>
                      <span>{rolesList.length} Role(s) Added</span>
                    </div>

                    {/* Roles Added List */}
                    {rolesList.length > 0 && (
                      <div className="space-y-2">
                        {rolesList.map((role) => (
                          <div key={role.id} className="bg-[#151B2D] border border-[#222F4C] p-3 rounded-xl flex justify-between items-start text-xs">
                            <div>
                              <div className="font-bold text-white">{role.roleName}</div>
                              {role.description && <p className="text-slate-300 text-xs mt-0.5">{role.description}</p>}
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {role.skillsNeeded.map((s) => (
                                  <span key={s} className="text-[0.62rem] font-mono bg-[#635BFF]/15 border border-[#635BFF]/30 px-1.5 py-0.2 rounded text-[#9D98FF]">{s}</span>
                                ))}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeRole(role.id)}
                              className="text-rose-400 hover:text-rose-300 font-mono text-xs ml-2"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add role inputs */}
                    <div className="bg-[#151B2D] border border-[#222F4C] p-3.5 rounded-xl space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[0.65rem] font-mono uppercase text-slate-400 mb-1">Role Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Frontend Engineer"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            className="w-full bg-[#0B1020] border border-[#222F4C] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                          />
                        </div>
                        <div>
                          <label className="block text-[0.65rem] font-mono uppercase text-slate-400 mb-1">Required Skills (comma separated)</label>
                          <input
                            type="text"
                            placeholder="e.g. React, Framer Motion"
                            value={newRoleSkills}
                            onChange={(e) => setNewRoleSkills(e.target.value)}
                            className="w-full bg-[#0B1020] border border-[#222F4C] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[0.65rem] font-mono uppercase text-slate-400 mb-1">Description of duties</label>
                        <input
                          type="text"
                          placeholder="e.g. Implement real-time canvas visualizer controls"
                          value={newRoleDesc}
                          onChange={(e) => setNewRoleDesc(e.target.value)}
                          className="w-full bg-[#0B1020] border border-[#222F4C] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addRole}
                        className="bg-[#635BFF] hover:bg-[#5249e0] text-white font-medium text-xs px-3.5 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm"
                      >
                        + Add Role to Requirements
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Sponsor Sub-form */}
                {helpNeeded.sponsor && (
                  <div className="bg-[#0B1020]/70 border border-[#222F4C] rounded-2xl p-4 space-y-3">
                    <div className="text-xs border-b border-[#222F4C] pb-2 font-mono font-semibold text-amber-400">
                      Sponsorship Milestones
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Funding Goal Target Amount ($)</label>
                      <div className="relative max-w-[200px]">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-400">$</span>
                        <input
                          type="number"
                          placeholder="e.g. 1000"
                          value={fundingGoal}
                          onChange={(e) => setFundingGoal(e.target.value)}
                          className="w-full pl-7 pr-3 py-1.5 bg-[#151B2D] border border-[#222F4C] rounded-xl text-xs text-white focus:outline-none focus:border-[#635BFF]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Guidance Sub-form */}
                {helpNeeded.guide && (
                  <div className="bg-[#0B1020]/70 border border-[#222F4C] rounded-2xl p-4 space-y-3">
                    <div className="text-xs border-b border-[#222F4C] pb-2 font-mono font-semibold text-purple-400">
                      Post an Initial Mentorship Topic
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">What technical architecture question do you need guidance on?</label>
                      <input
                        type="text"
                        placeholder="e.g. What is the optimal vector index configuration for client-side search?"
                        value={initialQuestion}
                        onChange={(e) => setInitialQuestion(e.target.value)}
                        className="w-full bg-[#151B2D] border border-[#222F4C] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                      />
                    </div>
                  </div>
                )}

                {/* 4. Contribute Sub-form */}
                {helpNeeded.contribute && (
                  <div className="bg-[#0B1020]/70 border border-[#222F4C] rounded-2xl p-4 space-y-4">
                    <div className="flex justify-between items-center text-xs border-b border-[#222F4C] pb-2 font-mono font-semibold text-emerald-400">
                      <span>Starter Tasks & Issues</span>
                      <span>{issuesList.length} Issue(s) Added</span>
                    </div>

                    {/* Issues Added List */}
                    {issuesList.length > 0 && (
                      <div className="space-y-2">
                        {issuesList.map((issue) => (
                          <div key={issue.id} className="bg-[#151B2D] border border-[#222F4C] p-2.5 rounded-xl flex justify-between items-center text-xs">
                            <div>
                              <span className="font-bold text-white">{issue.title}</span>
                              <span className="text-[0.62rem] ml-2 font-mono uppercase px-2 py-0.5 rounded-full bg-[#0B1020] border border-[#222F4C] text-slate-300">{issue.difficulty}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeIssue(issue.id)}
                              className="text-rose-400 hover:text-rose-300 font-mono text-xs ml-2"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add issue inputs */}
                    <div className="bg-[#151B2D] border border-[#222F4C] p-3 rounded-xl flex flex-col sm:flex-row gap-3 items-end">
                      <div className="flex-grow">
                        <label className="block text-[0.65rem] font-mono uppercase text-slate-400 mb-1">Issue Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Add dark mode toggle in nav"
                          value={newIssueTitle}
                          onChange={(e) => setNewIssueTitle(e.target.value)}
                          className="w-full bg-[#0B1020] border border-[#222F4C] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#635BFF]"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.65rem] font-mono uppercase text-slate-400 mb-1">Difficulty</label>
                        <select
                          value={newIssueDifficulty}
                          onChange={(e) => setNewIssueDifficulty(e.target.value as any)}
                          className="bg-[#0B1020] border border-[#222F4C] rounded-lg px-2 py-1 text-xs text-white focus:outline-none min-w-[100px]"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={addIssue}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm"
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
        <div className="p-4 bg-[#0B1020]/90 border-t border-[#222F4C] flex justify-between items-center text-xs font-mono">
          <button
            type="button"
            onClick={step === 1 ? onClose : prevStep}
            className="text-slate-400 hover:text-white border border-[#222F4C] hover:border-slate-500 rounded-xl px-4 py-2 transition-all"
          >
            {step === 1 ? 'Cancel' : '← Back'}
          </button>
          
          <button
            type="button"
            onClick={step === 3 ? handleFinalSubmit : nextStep}
            className="bg-[#635BFF] hover:bg-[#5249e0] text-white font-semibold rounded-xl px-5 py-2 shadow-md shadow-[#635BFF]/25 active:scale-95 transition-all"
          >
            {step === 3 ? 'Publish Project Idea ➔' : 'Continue ➔'}
          </button>
        </div>

      </div>
    </div>
  );
}
