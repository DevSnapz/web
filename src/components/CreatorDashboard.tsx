import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project, CollaboratorApplication } from '../types';

interface CreatorDashboardProps {
  projects: Project[];
  applications: CollaboratorApplication[];
  onApproveApplication: (appId: string) => void;
  onDeclineApplication: (appId: string) => void;
  onReplyToGuidance: (projectId: string, topicId: string, replyText: string, isCreator: boolean) => void;
  onCloseIssue: (projectId: string, issueId: string) => void;
}

type SidebarSection = 'overview' | 'projects' | 'collaborators' | 'requests';

export default function CreatorDashboard({
  projects,
  applications,
  onApproveApplication,
  onDeclineApplication,
  onReplyToGuidance,
  onCloseIssue,
}: CreatorDashboardProps) {
  const [activeSection, setActiveSection] = useState<SidebarSection>('overview');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const totalPendingApps = applications.filter((app) => app.status === 'pending').length;
  const projectApplications = applications.filter((app) => app.projectId === currentProject?.id);

  const handleReplyChange = (topicId: string, value: string) => {
    setReplyInput((prev) => ({ ...prev, [topicId]: value }));
  };

  const submitCreatorReply = (topicId: string) => {
    const text = replyInput[topicId];
    if (!text || !text.trim() || !currentProject) return;
    onReplyToGuidance(currentProject.id, topicId, text, true);
    setReplyInput((prev) => ({ ...prev, [topicId]: '' }));
  };

  const sidebarItemClass = (section: SidebarSection) =>
    `w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-sans flex items-center justify-between transition-all ${
      activeSection === section
        ? 'bg-[#F3F1FF] dark:bg-[rgba(56,139,253,0.15)] text-[#1f6feb] dark:text-[#58a6ff] font-semibold border border-[#1f6feb]/25 dark:border-[#1f6feb]/50 shadow-xs'
        : 'text-[#6B7280] dark:text-[#9198a1] hover:text-[#111827] dark:hover:text-[#f0f6fc] hover:bg-[#F7F8FC] dark:hover:bg-[#010409] border border-transparent font-medium'
    }`;

  return (
    <section id="workspace-dashboard" className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* LEFT SIDEBAR: 250px on desktop */}
        <aside className="md:col-span-4 lg:col-span-3 bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-5 shadow-xs space-y-6">
          <div>
            <div className="text-[0.68rem] font-mono uppercase tracking-wider text-[#9CA3AF] dark:text-[#656c76] font-semibold mb-3 px-1">
              Workspace
            </div>

            <nav className="space-y-1.5">
              <button
                type="button"
                onClick={() => setActiveSection('overview')}
                className={sidebarItemClass('overview')}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-sm">📊</span>
                  <span>Overview</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('projects')}
                className={sidebarItemClass('projects')}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-sm">📁</span>
                  <span>My Projects</span>
                </span>
                <span className="text-[0.68rem] font-mono px-2 py-0.5 rounded-md bg-[#F7F8FC] dark:bg-[#010409] text-[#6B7280] dark:text-[#9198a1]">
                  {projects.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('collaborators')}
                className={sidebarItemClass('collaborators')}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-sm">👥</span>
                  <span>Collaborators</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('requests')}
                className={sidebarItemClass('requests')}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-sm">👤+</span>
                  <span>Requests</span>
                </span>
                {totalPendingApps > 0 && (
                  <span className="text-[0.65rem] font-bold font-mono px-2 py-0.5 rounded-full bg-[#cf222e] dark:bg-[#ff7b72] text-white dark:text-[#0d1117]">
                    {totalPendingApps}
                  </span>
                )}
              </button>

              <Link
                to="/profile"
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-sans text-[#6B7280] dark:text-[#9198a1] hover:text-[#111827] dark:hover:text-[#f0f6fc] hover:bg-[#F7F8FC] dark:hover:bg-[#010409] flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-sm">👤</span>
                  <span>My Profile</span>
                </span>
                <span className="text-[0.68rem] text-[#9CA3AF] dark:text-[#656c76]">↗</span>
              </Link>
            </nav>
          </div>

          {/* Quick Publish Action */}
          <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#3d444d]">
            <Link
              to="/explore"
              className="w-full block text-center py-2 px-3 rounded-xl bg-[#ddf4ff] dark:bg-[rgba(56,139,253,0.15)] text-[#1f6feb] dark:text-[#79c0ff] hover:bg-[#1f6feb] hover:text-white dark:hover:bg-[#1f6feb] dark:hover:text-white text-xs font-semibold transition-all border border-[#1f6feb]/25 dark:border-[#1f6feb]/40 shadow-xs"
            >
              + Browse Project Gallery
            </Link>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT AREA */}
        <main className="md:col-span-8 lg:col-span-9 space-y-8">
          
          {/* Main Heading */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#f0f6fc] tracking-tight">
              Your workspace
            </h1>
            <p className="text-sm text-[#6B7280] dark:text-[#9198a1] mt-1">
              Keep your ideas moving forward.
            </p>
          </div>

          {/* SUMMARY CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Summary Card 1: My Projects */}
            <div className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-6 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#ddf4ff] dark:bg-[rgba(56,139,253,0.15)] text-[#1f6feb] dark:text-[#79c0ff] flex items-center justify-center text-xl font-bold">
                📁
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#9CA3AF] dark:text-[#656c76] font-semibold">
                  My projects
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-[#f0f6fc] mt-0.5">
                  {projects.length} Active {projects.length === 1 ? 'Project' : 'Projects'}
                </div>
              </div>
            </div>

            {/* Summary Card 2: Collaboration Requests */}
            <div className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-6 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#ddf4ff] dark:bg-[rgba(56,139,253,0.15)] text-[#1f6feb] dark:text-[#79c0ff] flex items-center justify-center text-xl font-bold">
                👤+
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#9CA3AF] dark:text-[#656c76] font-semibold">
                  Collaboration requests
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-[#f0f6fc] mt-0.5 flex items-center gap-2">
                  <span>{totalPendingApps} Pending Review</span>
                  {totalPendingApps > 0 && (
                    <span className="w-2 h-2 rounded-full bg-[#ff7b72] animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* EXACT RECOMMENDED FOR YOU SECTION */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#f0f6fc]">
              Recommended for you
            </h2>

            <div className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-bold text-base text-[#111827] dark:text-[#f0f6fc]">
                  StudyMate AI is looking for a frontend developer.
                </h3>
                <span className="text-xs font-semibold text-[#cf222e] dark:text-[#ff7b72] bg-[#ffebe9] dark:bg-[rgba(248,81,73,0.15)] border border-[#ff8182]/30 dark:border-[rgba(248,81,73,0.45)] px-2.5 py-0.5 rounded-full self-start sm:self-auto flex items-center gap-1">
                  <span>⚡</span>
                  <span>Open to join</span>
                </span>
              </div>

              {/* High Contrast Tritanopia Skill Matching Panel */}
              <div className="bg-[#F7F8FC] dark:bg-[#010409] border border-[#E5E7EB] dark:border-[#3d444d] rounded-xl p-4 space-y-1">
                <div className="text-xs font-bold text-[#0969da] dark:text-[#79c0ff] flex items-center gap-1.5">
                  <span>✨</span>
                  <span>Relevant competencies: React and TypeScript (Verified)</span>
                </div>
                <p className="text-xs text-[#4B5563] dark:text-[#9198a1] leading-relaxed">
                  Your verified technical competencies match 2 required project skills.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  to="/projects/studymate-ai"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1f6feb] dark:text-[#58a6ff] hover:text-[#2a7aef] dark:hover:text-[#79c0ff] transition-all"
                >
                  <span>View Project Hub</span>
                  <span>➔</span>
                </Link>
              </div>
            </div>
          </div>

          {/* CANDIDATE REVIEW PIPELINE (COLLABORATION REQUESTS) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] dark:border-[#3d444d]">
              <h2 className="text-lg font-bold text-[#111827] dark:text-[#f0f6fc]">
                Pending Candidate Applications
              </h2>
              <span className="text-xs font-mono text-[#6B7280] dark:text-[#9198a1]">
                {applications.length} Total Applications
              </span>
            </div>

            {applications.length === 0 ? (
              <div className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-8 text-center text-xs text-[#6B7280] dark:text-[#9198a1]">
                No collaboration requests pending review right now.
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white dark:bg-[#151b23] border border-[#E5E7EB] dark:border-[#3d444d] rounded-2xl p-5 sm:p-6 shadow-xs space-y-3.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-[#111827] dark:text-[#f0f6fc]">{app.applicantName}</span>
                          <span className="text-xs text-[#6B7280] dark:text-[#9198a1]">({app.applicantEmail})</span>
                        </div>
                        <div className="text-[0.68rem] font-mono text-[#9CA3AF] dark:text-[#656c76] mt-0.5">
                          Applied on {new Date(app.appliedAt).toLocaleDateString()} for <span className="font-semibold text-[#111827] dark:text-[#f0f6fc]">{app.projectTitle}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#0969da] dark:text-[#79c0ff] bg-[#ddf4ff] dark:bg-[rgba(56,139,253,0.15)] px-2.5 py-1 border border-[#54aeff]/30 dark:border-[rgba(56,139,253,0.4)] rounded-lg font-semibold">
                          Role: {app.roleName}
                        </span>
                        <span className={`text-[0.62rem] font-bold font-mono uppercase px-2.5 py-1 rounded-full border ${
                          app.status === 'pending'
                            ? 'bg-[#ffebe9] dark:bg-[rgba(248,81,73,0.15)] text-[#cf222e] dark:text-[#ff7b72] border-[#ff8182]/30 dark:border-[rgba(248,81,73,0.45)]'
                            : app.status === 'approved'
                            ? 'bg-[#ddf4ff] dark:bg-[rgba(56,139,253,0.15)] text-[#0969da] dark:text-[#79c0ff] border-[#54aeff]/30 dark:border-[rgba(56,139,253,0.4)]'
                            : 'bg-[#F7F8FC] dark:bg-[#010409] text-[#6B7280] dark:text-[#9198a1] border-[#E5E7EB] dark:border-[#3d444d]'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#F7F8FC] dark:bg-[#010409] border border-[#E5E7EB] dark:border-[#3d444d] p-3.5 rounded-xl text-xs text-[#111827] dark:text-[#f0f6fc] space-y-1.5">
                      <div>
                        <span className="text-[#9CA3AF] dark:text-[#656c76] font-mono text-[0.65rem] uppercase block">Competencies & Pitch:</span>
                        <span className="text-[#4B5563] dark:text-[#9198a1]">{app.skills}</span>
                      </div>
                      <p className="text-xs text-[#6B7280] dark:text-[#9198a1] italic leading-relaxed">"{app.message}"</p>
                    </div>

                    {app.status === 'pending' && (
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onDeclineApplication(app.id)}
                          className="px-4 py-2 text-xs font-semibold text-[#cf222e] dark:text-[#ff7b72] hover:bg-[#ffebe9] dark:hover:bg-[rgba(248,81,73,0.15)] border border-[#ff8182]/30 dark:border-[rgba(248,81,73,0.45)] rounded-xl transition-all"
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => onApproveApplication(app.id)}
                          className="px-4 py-2 text-xs font-semibold text-white bg-[#1f6feb] hover:bg-[#2a7aef] rounded-xl shadow-xs transition-all active:scale-95"
                        >
                          Approve & Add to Team
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </section>
  );
}
