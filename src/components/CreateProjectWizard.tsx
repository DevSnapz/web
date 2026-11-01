import React, { useState } from 'react';
import { Project, OpenRole, ContributeIssue } from '../types';

interface CreateProjectWizardProps {
  onClose: () => void;
  onSubmit: (project: Project) => void;
}

export default function CreateProjectWizard({ onClose, onSubmit }: CreateProjectWizardProps) {
  // Step 1: Repo details
  const [repoName, setRepoName] = useState('');
  const [pitch, setPitch] = useState('');
  const [description, setDescription] = useState('');
  const [creatorName, setCreatorName] = useState('Frozen');
  const [creatorGithub, setCreatorGithub] = useState('Frozen-47');
  const [creatorAvatar] = useState('https://avatars.githubusercontent.com/u/174297688?s=96&v=4');

  // Tech & Links
  const [techInput, setTechInput] = useState('React, TypeScript, Tailwind CSS');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');

  // Skill-Gap Roles
  const [rolesList, setRolesList] = useState<OpenRole[]>([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleSkills, setNewRoleSkills] = useState('');

  // Starter Task Issue
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [issuesList, setIssuesList] = useState<ContributeIssue[]>([]);

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
      difficulty: 'easy',
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
    if (!repoName.trim() || !pitch.trim()) {
      alert('Please fill out repository name and description');
      return;
    }

    const techStack = techInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    const projectId = repoName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProject: Project = {
      id: projectId,
      title: repoName,
      pitch,
      description: description || pitch,
      creatorName,
      creatorAvatar,
      creatorGithub: creatorGithub || undefined,
      bannerGradient: 'from-blue-600 via-indigo-600 to-violet-700',
      techStack: techStack.length > 0 ? techStack : ['React', 'TypeScript'],
      githubUrl: githubUrl || `https://github.com/DevSnapz/${projectId}`,
      liveUrl: liveUrl || undefined,
      helpNeeded: {
        sponsor: false,
        collaborate: rolesList.length > 0,
        guide: false,
        contribute: issuesList.length > 0,
      },
      openRoles: rolesList,
      sponsorshipTiers: [
        { id: 't-1', name: 'Student Coffee Sponsor', amount: 5, benefits: 'Name in README' },
        { id: 't-2', name: 'Server Supporter', amount: 25, benefits: 'Featured spot in repository' },
      ],
      sponsorsList: [],
      guidanceTopics: [],
      contributeIssues: issuesList,
    };

    onSubmit(newProject);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[#151b23] border border-[#3d444d] rounded-md shadow-2xl overflow-hidden flex flex-col my-8 text-xs text-[#f0f6fc]">
        
        {/* GitHub Header */}
        <div className="px-6 py-4 border-b border-[#3d444d] flex justify-between items-center bg-[#151b23]">
          <div>
            <h2 className="font-bold text-base text-[#f0f6fc]">Create a new repository</h2>
            <p className="text-[#9198a1] text-xs mt-0.5">
              A repository contains all student project files, commit history, and skill-gap requirements.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#9198a1] hover:text-[#f0f6fc] text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFinalSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-5">
          
          {/* Owner / Repository Name */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div>
                <label className="block text-[11px] font-mono text-[#9198a1] mb-1">Owner</label>
                <div className="px-3 py-1.5 bg-[#21262d] border border-[#3d444d] rounded-md font-semibold text-xs flex items-center gap-1.5">
                  <span>{creatorName}</span>
                  <span className="text-[10px] text-[#9198a1]">▾</span>
                </div>
              </div>

              <span className="text-base text-[#9198a1] mt-5">/</span>

              <div className="flex-grow">
                <label className="block text-[11px] font-mono text-[#9198a1] mb-1">
                  Repository name <span className="text-[#ff7b72]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. campus-recycling-app"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#010409] border border-[#3d444d] rounded-md text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
                />
              </div>
            </div>
            <p className="text-[11px] text-[#9198a1]">
              Great repository names are short and memorable.
            </p>
          </div>

          {/* One-line Pitch */}
          <div>
            <label className="block text-[11px] font-mono text-[#9198a1] mb-1">
              One-sentence Pitch <span className="text-[#ff7b72]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Real-time IoT campus recycling telemetry and student rewards"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#010409] border border-[#3d444d] rounded-md text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-mono text-[#9198a1] mb-1">
              Description / Architecture details
            </label>
            <textarea
              rows={3}
              placeholder="Explain problem statement, system architecture, and tech decisions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#010409] border border-[#3d444d] rounded-md text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] resize-none"
            />
          </div>

          {/* Technical Stack */}
          <div>
            <label className="block text-[11px] font-mono text-[#9198a1] mb-1">
              Technical Stack (comma separated) <span className="text-[#ff7b72]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="React, TypeScript, Node.js, PostgreSQL"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#010409] border border-[#3d444d] rounded-md text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-[#9198a1] mb-1">GitHub Repo URL</label>
              <input
                type="url"
                placeholder="https://github.com/Frozen-47/my-repo"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#010409] border border-[#3d444d] rounded-md text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#9198a1] mb-1">Live Demo URL</label>
              <input
                type="url"
                placeholder="https://demo.devsnapz.org"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#010409] border border-[#3d444d] rounded-md text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]"
              />
            </div>
          </div>

          {/* Visibility Section */}
          <div className="border-t border-[#3d444d] pt-3 space-y-2">
            <div className="flex items-start gap-2.5 p-2 rounded bg-[#010409] border border-[#3d444d]">
              <input type="radio" checked readOnly className="mt-1" />
              <div>
                <span className="font-bold text-xs text-[#f0f6fc]">Public</span>
                <p className="text-[11px] text-[#9198a1]">
                  Anyone in the student network can view this repository and apply for open skill gaps.
                </p>
              </div>
            </div>
          </div>

          {/* Skill-Gap Configuration */}
          <div className="border-t border-[#3d444d] pt-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#f0f6fc]">
                ⚡ Open Collaboration Roles (Skill Gaps)
              </span>
              <span className="text-[11px] font-mono text-[#9198a1]">
                {rolesList.length} role(s) configured
              </span>
            </div>

            {rolesList.map((r) => (
              <div key={r.id} className="p-2.5 bg-[#010409] border border-[#3d444d] rounded flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-[#f0f6fc]">{r.roleName}</span>
                  <span className="text-[#9198a1] ml-2 font-mono text-[11px]">{r.skillsNeeded.join(', ')}</span>
                </div>
                <button type="button" onClick={() => removeRole(r.id)} className="text-[#ff7b72] hover:underline">
                  Remove
                </button>
              </div>
            ))}

            <div className="p-3 bg-[#010409] border border-[#3d444d] rounded space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Role Name (e.g. Frontend Dev)"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="px-2.5 py-1 bg-[#151b23] border border-[#3d444d] rounded text-xs text-[#f0f6fc]"
                />
                <input
                  type="text"
                  placeholder="Skills Needed (e.g. React, Tailwind)"
                  value={newRoleSkills}
                  onChange={(e) => setNewRoleSkills(e.target.value)}
                  className="px-2.5 py-1 bg-[#151b23] border border-[#3d444d] rounded text-xs text-[#f0f6fc]"
                />
              </div>
              <button
                type="button"
                onClick={addRole}
                className="px-3 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#3d444d] rounded font-semibold text-[#f0f6fc]"
              >
                + Add Role to Requirements
              </button>
            </div>
          </div>

          {/* Starter Tasks Issues */}
          <div className="border-t border-[#3d444d] pt-3 space-y-2">
            <span className="font-bold text-xs text-[#f0f6fc]">
              ⊙ Starter Task Issue (Optional)
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Add responsive navbar toggle"
                value={newIssueTitle}
                onChange={(e) => setNewIssueTitle(e.target.value)}
                className="flex-grow px-2.5 py-1 bg-[#010409] border border-[#3d444d] rounded text-xs text-[#f0f6fc]"
              />
              <button
                type="button"
                onClick={addIssue}
                className="px-3 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#3d444d] rounded font-semibold text-[#f0f6fc]"
              >
                + Add Issue
              </button>
            </div>
            {issuesList.map((i) => (
              <div key={i.id} className="p-2 bg-[#010409] border border-[#3d444d] rounded flex justify-between items-center text-xs">
                <span>{i.title}</span>
                <button type="button" onClick={() => removeIssue(i.id)} className="text-[#ff7b72] hover:underline">
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-[#3d444d] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-[#3d444d] rounded-md text-[#9198a1] hover:text-[#f0f6fc]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md shadow-xs"
            >
              Create repository
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
