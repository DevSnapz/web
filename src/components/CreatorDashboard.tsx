import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project, CollaboratorApplication } from '../types';
import { GitPullRequestIcon, ZapIcon } from './Octicons';

interface CreatorDashboardProps {
  projects: Project[];
  applications: CollaboratorApplication[];
  onApproveApplication: (appId: string) => void;
  onDeclineApplication: (appId: string) => void;
  onReplyToGuidance: (projectId: string, topicId: string, replyText: string, isCreator: boolean) => void;
  onCloseIssue: (projectId: string, issueId: string) => void;
}

export default function CreatorDashboard({
  projects,
  applications,
  onApproveApplication,
  onDeclineApplication,
}: CreatorDashboardProps) {
  const [repoFilter, setRepoFilter] = useState('');

  const totalPendingApps = applications.filter((app) => app.status === 'pending').length;

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(repoFilter.toLowerCase()) ||
    p.id.toLowerCase().includes(repoFilter.toLowerCase())
  );

  return (
    <div className="bg-[#0d1117] min-h-screen text-[#f0f6fc] py-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* =============================================================== */}
          {/* LEFT SIDEBAR: GITHUB TOP REPOSITORIES LIST (approx 3-4 cols)    */}
          {/* =============================================================== */}
          <aside className="md:col-span-4 lg:col-span-3 space-y-4">
            
            <div className="border border-[#3d444d] rounded-md bg-[#151b23] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#f0f6fc]">Your Projects</span>
                <Link
                  to="/profile"
                  className="px-2.5 py-1 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md text-[11px] shadow-xs"
                >
                  + New
                </Link>
              </div>

              {/* Project Search filter */}
              <input
                type="text"
                value={repoFilter}
                onChange={(e) => setRepoFilter(e.target.value)}
                placeholder="Find a project..."
                className="w-full bg-[#010409] border border-[#3d444d] rounded-md px-2.5 py-1 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] placeholder-[#9198a1]"
              />

              {/* Repos list */}
              <div className="space-y-1 pt-1">
                {filteredProjects.map((p) => (
                  <Link
                    key={p.id}
                    to={`/projects/${p.id}`}
                    className="flex items-center gap-2 p-1.5 rounded-md hover:bg-[#21262d] text-xs font-mono text-[#58a6ff] hover:underline truncate"
                  >
                    <RepoIcon className="w-3.5 h-3.5 fill-current text-[#9198a1] flex-shrink-0" />
                    <span className="truncate">{p.id}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Navigation links */}
            <div className="border border-[#3d444d] rounded-md bg-[#151b23] p-3 text-xs space-y-1 text-[#9198a1]">
              <div className="font-bold text-[#f0f6fc] px-2 py-1">Workspace</div>
              <Link to="/explore" className="block px-2 py-1.5 rounded hover:bg-[#21262d] hover:text-[#f0f6fc]">
                Explore Directory
              </Link>
              <Link to="/profile" className="block px-2 py-1.5 rounded hover:bg-[#21262d] hover:text-[#f0f6fc]">
                Your Student Profile
              </Link>
            </div>

          </aside>

          {/* =============================================================== */}
          {/* MAIN COLUMN: PENDING PRs & REPOSITORY UPDATES (approx 8-9 cols) */}
          {/* =============================================================== */}
          <main className="md:col-span-8 lg:col-span-9 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#3d444d]">
              <div>
                <h1 className="text-xl font-bold text-[#f0f6fc]">
                  Maintainer Workspace
                </h1>
                <p className="text-xs text-[#9198a1] mt-0.5">
                  Review collaboration pull requests and manage team permissions.
                </p>
              </div>

              {totalPendingApps > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-[rgba(248,81,73,0.15)] text-[#ff7b72] border border-[rgba(248,81,73,0.4)] text-xs font-mono font-bold">
                  {totalPendingApps} Review Requests Pending
                </span>
              )}
            </div>

            {/* PULL REQUESTS / COLLABORATION APPLICATIONS REVIEW QUEUE */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <h2 className="font-bold text-sm text-[#f0f6fc]">
                  Incoming Collaboration Applications
                </h2>
                <span className="text-xs font-mono text-[#9198a1]">
                  {applications.length} Total Applications
                </span>
              </div>

              {applications.length === 0 ? (
                <div className="border border-[#3d444d] rounded-md bg-[#151b23] p-8 text-center text-xs text-[#9198a1]">
                  No pull requests currently open for your repositories.
                </div>
              ) : (
                <div className="border border-[#3d444d] rounded-md bg-[#151b23] divide-y divide-[#3d444d]">
                  {applications.map((app) => (
                    <div key={app.id} className="p-4 space-y-3 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <GitPullRequestIcon
                            className={`w-3.5 h-3.5 fill-current ${
                              app.status === 'approved'
                                ? 'text-[#79c0ff]'
                                : app.status === 'pending'
                                ? 'text-[#ff7b72]'
                                : 'text-[#9198a1]'
                            }`}
                          />
                          <span className="font-bold text-sm text-[#f0f6fc]">
                            {app.applicantName}
                          </span>
                          <span className="text-[#9198a1]">wants to join</span>
                          <span className="font-semibold text-[#58a6ff]">
                            {app.projectTitle}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[rgba(56,139,253,0.15)] text-[#79c0ff] border border-[rgba(56,139,253,0.3)] font-mono text-[10px]">
                            Role: {app.roleName}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${
                            app.status === 'pending'
                              ? 'bg-[rgba(248,81,73,0.15)] text-[#ff7b72] border-[rgba(248,81,73,0.4)]'
                              : app.status === 'approved'
                              ? 'bg-[rgba(56,139,253,0.15)] text-[#79c0ff] border-[rgba(56,139,253,0.4)]'
                              : 'bg-[#21262d] text-[#9198a1] border-[#3d444d]'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      </div>

                      {/* Pull Request Description / Pitch Box */}
                      <div className="p-3 bg-[#010409] border border-[#3d444d] rounded-md space-y-1.5 font-mono text-[11px]">
                        <div className="text-[#9198a1]">
                          Contact: <span className="text-[#f0f6fc]">{app.applicantEmail}</span>
                        </div>
                        <div className="text-[#79c0ff]">
                          Competencies: {app.skills}
                        </div>
                        <p className="text-[#f0f6fc] font-sans text-xs italic pt-1">
                          "{app.message}"
                        </p>
                      </div>

                      {app.status === 'pending' && (
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => onDeclineApplication(app.id)}
                            className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#3d444d] rounded-md text-[#ff7b72] font-semibold text-xs transition-colors"
                          >
                            Close PR (Decline)
                          </button>
                          <button
                            type="button"
                            onClick={() => onApproveApplication(app.id)}
                            className="px-3.5 py-1.5 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md text-xs shadow-xs transition-colors"
                          >
                            Merge & Add to Team ➔
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RECOMMENDATIONS FOR YOU */}
            <div className="border border-[#3d444d] rounded-md bg-[#151b23] p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#f0f6fc]">
                  Recommended Repository for You
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[rgba(248,81,73,0.15)] text-[#ff7b72] border border-[rgba(248,81,73,0.4)] font-bold flex items-center gap-1">
                  <ZapIcon className="w-3 h-3 fill-current text-[#ff7b72]" />
                  <span>Open to Join</span>
                </span>
              </div>

              <p className="text-[#9198a1]">
                <strong>StudyMate AI</strong> is looking for a frontend developer. Your verified technical competencies (React, TypeScript) match 2 required skills.
              </p>

              <div className="pt-2 flex justify-end">
                <Link
                  to="/projects/studymate-ai"
                  className="text-[#58a6ff] hover:underline font-semibold"
                >
                  View Project ➔
                </Link>
              </div>
            </div>

          </main>
        </div>

      </div>
    </div>
  );
}
