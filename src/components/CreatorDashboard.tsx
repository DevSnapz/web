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

export default function CreatorDashboard({
  projects,
  applications,
  onApproveApplication,
  onDeclineApplication,
  onReplyToGuidance,
  onCloseIssue,
}: CreatorDashboardProps) {
  // Let the user manage projects. By default, pick the first project
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'guidance' | 'sponsors' | 'issues'>('applications');
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const projectApplications = applications.filter((app) => app.projectId === currentProject?.id);
  const pendingAppsCount = projectApplications.filter((app) => app.status === 'pending').length;

  const totalPendingAllProjects = applications.filter((app) => app.status === 'pending').length;
  const totalGuidanceQueries = projects.reduce((acc, p) => acc + (p.guidanceTopics?.length || 0), 0);
  const totalIssues = projects.reduce((acc, p) => acc + (p.contributeIssues?.filter((i) => i.status === 'open').length || 0), 0);

  const handleReplyChange = (topicId: string, value: string) => {
    setReplyInput((prev) => ({ ...prev, [topicId]: value }));
  };

  const submitCreatorReply = (topicId: string) => {
    const text = replyInput[topicId];
    if (!text || !text.trim() || !currentProject) return;
    onReplyToGuidance(currentProject.id, topicId, text, true);
    setReplyInput((prev) => ({ ...prev, [topicId]: '' }));
  };

  if (projects.length === 0) {
    return (
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center">
        <div className="bg-[#151B2D]/90 border border-[#222F4C] rounded-2xl p-12 max-w-lg mx-auto shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#0B1020] border border-[#222F4C] flex items-center justify-center mx-auto mb-4 text-slate-400">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
            </svg>
          </div>
          <h3 className="font-bold text-lg text-white mb-2">No projects owned yet</h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            You haven't showcased any projects yet. Head over to the Explore directory or click below to publish your first innovation build.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#635BFF] hover:bg-[#5249e0] text-white rounded-xl text-xs font-semibold shadow-md shadow-[#635BFF]/25 transition-all"
          >
            Explore Student Projects
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section id="creator-dashboard" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#222F4C]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#635BFF]/10 border border-[#635BFF]/30 text-[#9D98FF] text-xs font-mono tracking-wider uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" />
            Creator Workspace & Review Pipeline
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Manage Projects & Review Teammates
          </h1>
          <p className="text-slate-300 text-sm mt-1.5 leading-relaxed">
            Review collaborator applications, answer community guidance queries, track issues, and manage team rosters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/explore"
            className="px-4 py-2 bg-[#0B1020]/80 hover:bg-[#0B1020] text-slate-200 border border-[#222F4C] rounded-xl text-xs font-medium transition-all"
          >
            Browse Directory
          </Link>
          {currentProject && (
            <Link
              to={`/projects/${currentProject.id}`}
              className="px-4 py-2 bg-[#635BFF] hover:bg-[#5249e0] text-white rounded-xl text-xs font-semibold shadow-md shadow-[#635BFF]/25 transition-all flex items-center gap-1.5"
            >
              <span>View Public Hub</span>
              <span>➔</span>
            </Link>
          )}
        </div>
      </div>

      {/* Platform Metric Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#151B2D]/80 border border-[#222F4C] rounded-2xl p-4 backdrop-blur-sm shadow-md">
          <div className="text-[0.68rem] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Active Projects
          </div>
          <div className="text-2xl font-extrabold text-white">{projects.length}</div>
          <div className="text-[0.7rem] text-slate-400 mt-1">Under your management</div>
        </div>

        <div className="bg-[#151B2D]/80 border border-[#222F4C] rounded-2xl p-4 backdrop-blur-sm shadow-md">
          <div className="text-[0.68rem] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Pending Requests</span>
            {totalPendingAllProjects > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#F9735B] animate-pulse" />
            )}
          </div>
          <div className="text-2xl font-extrabold text-[#F9735B]">{totalPendingAllProjects}</div>
          <div className="text-[0.7rem] text-slate-400 mt-1">Require your review</div>
        </div>

        <div className="bg-[#151B2D]/80 border border-[#222F4C] rounded-2xl p-4 backdrop-blur-sm shadow-md">
          <div className="text-[0.68rem] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Guidance Queries
          </div>
          <div className="text-2xl font-extrabold text-[#9D98FF]">{totalGuidanceQueries}</div>
          <div className="text-[0.7rem] text-slate-400 mt-1">Community Q&A topics</div>
        </div>

        <div className="bg-[#151B2D]/80 border border-[#222F4C] rounded-2xl p-4 backdrop-blur-sm shadow-md">
          <div className="text-[0.68rem] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Open Issues
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{totalIssues}</div>
          <div className="text-[0.7rem] text-slate-400 mt-1">Contribution tasks</div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Column: Project Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              Select Workspace
            </h3>
            <span className="text-xs font-mono text-slate-500">{projects.length} Total</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {projects.map((p) => {
              const isSelected = p.id === currentProject?.id;
              const pendingCount = applications.filter((app) => app.projectId === p.id && app.status === 'pending').length;
              
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedProjectId(p.id);
                    setActiveSubTab('applications');
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? 'border-[#635BFF] bg-[#151B2D] shadow-lg shadow-[#635BFF]/10 ring-1 ring-[#635BFF]/30'
                      : 'border-[#222F4C] hover:border-[#635BFF]/40 bg-[#151B2D]/60 hover:bg-[#151B2D]'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${p.bannerGradient} flex items-center justify-center text-xs font-bold text-white shadow-inner flex-shrink-0`}>
                      {p.title.substring(0, 2)}
                    </div>
                    <div className="truncate">
                      <span className={`font-bold text-xs block truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {p.title}
                      </span>
                      <span className="text-[0.65rem] font-mono text-slate-400 block truncate">
                        {p.techStack.slice(0, 2).join(' · ')}
                      </span>
                    </div>
                  </div>

                  {pendingCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#F9735B] text-white font-bold text-[0.62rem] flex items-center justify-center shadow-sm">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Panel: Workspace Tabs & Pipeline */}
        {currentProject && (
          <div className="md:col-span-3 bg-[#151B2D]/90 border border-[#222F4C] rounded-2xl overflow-hidden shadow-xl flex flex-col">
            
            {/* Top Workspace Header */}
            <div className="bg-[#0B1020]/70 p-5 border-b border-[#222F4C] flex flex-wrap justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-lg text-white">{currentProject.title}</h2>
                  <span className="text-[0.65rem] font-mono px-2 py-0.5 rounded-full bg-[#635BFF]/15 text-[#9D98FF] border border-[#635BFF]/30">
                    Workspace
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xl line-clamp-1">
                  {currentProject.pitch}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-center bg-[#151B2D] border border-[#222F4C] rounded-xl px-3 py-1.5">
                  <span className="text-[0.6rem] font-mono uppercase text-slate-400 block">Open Roles</span>
                  <span className="text-xs font-bold text-white font-mono">
                    {currentProject.openRoles?.filter((r) => r.status === 'open').length || 0}
                  </span>
                </div>
                <div className="text-center bg-[#151B2D] border border-[#222F4C] rounded-xl px-3 py-1.5">
                  <span className="text-[0.6rem] font-mono uppercase text-slate-400 block">Backers</span>
                  <span className="text-xs font-bold text-white font-mono">
                    {currentProject.sponsorsList?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Dashboard Subtabs Navigation */}
            <div className="flex border-b border-[#222F4C] bg-[#0B1020]/40 px-4 gap-2 overflow-x-auto">
              {[
                { id: 'applications', label: `Collab Pipeline (${pendingAppsCount})` },
                { id: 'guidance', label: `Guidance Queries (${currentProject.guidanceTopics?.length || 0})` },
                { id: 'sponsors', label: `Backers (${currentProject.sponsorsList?.length || 0})` },
                { id: 'issues', label: `Task Issues (${currentProject.contributeIssues?.length || 0})` },
              ].map((tab) => {
                const active = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
                    className={`py-3.5 px-3 text-xs font-semibold font-mono border-b-2 transition-all outline-none whitespace-nowrap ${
                      active
                        ? 'border-[#635BFF] text-[#635BFF]'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Subtab Contents */}
            <div className="p-6 overflow-y-auto max-h-[550px] min-h-[350px]">
              
              {/* SUBTAB 1: COLLABORATOR PIPELINE */}
              {activeSubTab === 'applications' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#222F4C]">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Candidate Applications
                    </h3>
                    <span className="text-xs font-mono text-slate-500">
                      {projectApplications.length} Total Applicants
                    </span>
                  </div>

                  {projectApplications.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 italic text-xs">
                      No collaborator applications received yet for this project.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {projectApplications.map((app) => (
                        <div
                          key={app.id}
                          className="bg-[#0B1020]/70 border border-[#222F4C] hover:border-[#635BFF]/30 rounded-2xl p-5 space-y-3.5 transition-all shadow-md"
                        >
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-white">{app.applicantName}</span>
                                <span className="text-xs font-mono text-slate-400">({app.applicantEmail})</span>
                              </div>
                              <div className="text-[0.68rem] font-mono text-slate-400 mt-0.5">
                                Applied on {new Date(app.appliedAt).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-[#9D98FF] bg-[#635BFF]/15 px-2.5 py-1 border border-[#635BFF]/25 rounded-lg font-semibold">
                                Role: {app.roleName}
                              </span>
                              <span className={`text-[0.62rem] font-bold font-mono uppercase px-2.5 py-1 rounded-full border ${
                                app.status === 'pending'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : app.status === 'approved'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              }`}>
                                {app.status}
                              </span>
                            </div>
                          </div>

                          <div className="bg-[#151B2D] border border-[#222F4C] p-3.5 rounded-xl text-xs text-slate-200 space-y-2">
                            <div>
                              <strong className="text-slate-400 font-mono text-[0.68rem] uppercase block mb-0.5">Stated Competencies</strong>
                              <span className="text-slate-300">{app.skills}</span>
                            </div>
                            <div>
                              <strong className="text-slate-400 font-mono text-[0.68rem] uppercase block mb-0.5">Applicant Note</strong>
                              <p className="leading-relaxed text-slate-300 italic">"{app.message}"</p>
                            </div>
                          </div>

                          {app.status === 'pending' && (
                            <div className="flex gap-2.5 pt-1 justify-end">
                              <button
                                onClick={() => onDeclineApplication(app.id)}
                                className="border border-rose-500/40 hover:border-rose-500 hover:bg-rose-500/10 text-rose-400 font-semibold text-xs px-4 py-2 rounded-xl transition-all"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => onApproveApplication(app.id)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-1.5"
                              >
                                <span>Approve & Add to Team</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 2: GUIDANCE QUERIES */}
              {activeSubTab === 'guidance' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#222F4C]">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Student Mentorship Board
                    </h3>
                    <span className="text-xs font-mono text-slate-500">
                      Answer questions publicly for your community
                    </span>
                  </div>

                  {!currentProject.guidanceTopics || currentProject.guidanceTopics.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 italic text-xs">
                      No guidance questions posted yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentProject.guidanceTopics.map((topic) => (
                        <div key={topic.id} className="bg-[#0B1020]/70 border border-[#222F4C] rounded-2xl p-4 sm:p-5 space-y-3">
                          <div>
                            <span className="text-[0.65rem] font-mono text-slate-400">
                              Asked by @{topic.askedBy.toLowerCase()} · {new Date(topic.askedAt).toLocaleDateString()}
                            </span>
                            <h4 className="font-bold text-sm text-white mt-1">
                              {topic.question}
                            </h4>
                          </div>

                          {/* Existing Replies */}
                          {topic.replies.length > 0 && (
                            <div className="pl-4 border-l-2 border-[#635BFF] space-y-2.5 my-3">
                              {topic.replies.map((rep) => (
                                <div key={rep.id} className="text-xs bg-[#151B2D] border border-[#222F4C] p-3 rounded-xl">
                                  <div className="flex justify-between font-mono text-[0.65rem] text-slate-400 mb-1">
                                    <span className="font-bold text-slate-200">
                                      @{rep.repliedBy.toLowerCase()} {rep.isCreator && '(Project Lead)'}
                                    </span>
                                    <span>{new Date(rep.repliedAt).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-slate-300 leading-relaxed">{rep.replyText}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply Input Form */}
                          <div className="pt-2 border-t border-[#222F4C] flex gap-2">
                            <input
                              type="text"
                              placeholder="Answer as the Project Creator..."
                              value={replyInput[topic.id] || ''}
                              onChange={(e) => handleReplyChange(topic.id, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') submitCreatorReply(topic.id);
                              }}
                              className="flex-grow bg-[#151B2D] border border-[#222F4C] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#635BFF]"
                            />
                            <button
                              onClick={() => submitCreatorReply(topic.id)}
                              className="bg-[#635BFF] hover:bg-[#5249e0] text-white font-medium text-xs px-4 py-2 rounded-xl shadow-md shadow-[#635BFF]/25 active:scale-95 transition-all"
                            >
                              Post Answer
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 3: SPONSORS & BACKERS */}
              {activeSubTab === 'sponsors' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#222F4C]">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Backers & Supporters
                    </h3>
                    <span className="text-xs font-mono text-slate-500">
                      Total: ${currentProject.fundingRaised || 0}
                    </span>
                  </div>

                  {!currentProject.sponsorsList || currentProject.sponsorsList.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 italic text-xs">
                      No financial support recorded yet for this build.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {currentProject.sponsorsList.map((sponsor, idx) => (
                        <div key={idx} className="bg-[#0B1020]/70 border border-[#222F4C] p-4 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={sponsor.avatar} alt={sponsor.name} className="w-9 h-9 rounded-full object-cover bg-[#151B2D]" />
                            <div>
                              <span className="font-bold text-xs text-white">{sponsor.name}</span>
                              {sponsor.message && (
                                <p className="text-[0.72rem] text-slate-300 italic mt-0.5">"{sponsor.message}"</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                              +${sponsor.amount}
                            </span>
                            <span className="text-[0.62rem] text-slate-500 block mt-1 font-mono">
                              {new Date(sponsor.sponsoredAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 4: ISSUES & TASKS */}
              {activeSubTab === 'issues' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#222F4C]">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Task Board & Community Issues
                    </h3>
                    <span className="text-xs font-mono text-slate-500">Mark completed tasks</span>
                  </div>

                  {!currentProject.contributeIssues || currentProject.contributeIssues.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 italic text-xs">
                      No contribution issues registered for this project.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentProject.contributeIssues.map((issue) => (
                        <div key={issue.id} className="bg-[#0B1020]/70 border border-[#222F4C] p-4 rounded-xl flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className={`text-[0.62rem] font-bold font-mono uppercase px-2 py-0.5 rounded-full border ${
                              issue.difficulty === 'easy'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : issue.difficulty === 'medium'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}>
                              {issue.difficulty}
                            </span>
                            <div>
                              <span className="font-bold text-xs text-white">{issue.title}</span>
                              <span className="text-[0.65rem] text-slate-400 block mt-0.5 font-mono">
                                Status: {issue.status}
                              </span>
                            </div>
                          </div>
                          
                          {issue.status !== 'merged' && (
                            <button
                              onClick={() => onCloseIssue(currentProject.id, issue.id)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-3.5 py-1.5 rounded-xl active:scale-95 transition-all shadow-md shadow-emerald-600/20"
                            >
                              Resolve Issue
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
