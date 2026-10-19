import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';

// Page components
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

// Modals
import CreateProjectWizard from './components/CreateProjectWizard';

// Data & Types
import { initialProjects } from './data/initialData';
import { Project, CollaboratorApplication, GuidanceTopic } from './types';

// Mock initial applications to seed the dashboard
const initialAppsSeed: CollaboratorApplication[] = [
  {
    id: 'app-seed-1',
    projectId: 'ai-verse',
    projectTitle: 'AiVerse',
    roleName: 'Frontend Engineer (Framer Motion)',
    applicantName: 'David Miller',
    applicantEmail: 'david.miller@code.io',
    skills: 'React, Tailwind CSS, Framer Motion, Canvas API (3 years)',
    message: 'Hey Frozen! I have been building multi-agent dashboards and custom layout grids. I would love to help build out the real-time canvas visualization editor.',
    status: 'pending',
    appliedAt: '2026-06-12T10:00:00Z',
  }
];

export default function App() {
  const navigate = useNavigate();
  const [showCreateWizard, setShowCreateWizard] = useState(false);

  // Core Platform States
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<CollaboratorApplication[]>([]);

  // Initialize data from localStorage or seed files
  useEffect(() => {
    // Theme setup
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light') document.documentElement.classList.add('light');
      else if (savedTheme === 'dark') document.documentElement.classList.remove('light');
      else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.classList.add('light');
      }
    } catch (e) { /* ignore */ }

    // Projects setup
    try {
      const savedProjects = localStorage.getItem('devsnapz_projects');
      if (savedProjects && !savedProjects.includes('commit-flow') && !savedProjects.includes('"fundingRaised":420') && !savedProjects.includes('words-museum')) {
        setProjects(JSON.parse(savedProjects));
      } else {
        setProjects(initialProjects);
        localStorage.setItem('devsnapz_projects', JSON.stringify(initialProjects));
      }
    } catch (e) {
      setProjects(initialProjects);
    }

    // Applications setup
    try {
      const savedApps = localStorage.getItem('devsnapz_applications');
      if (savedApps) {
        setApplications(JSON.parse(savedApps));
      } else {
        setApplications(initialAppsSeed);
        localStorage.setItem('devsnapz_applications', JSON.stringify(initialAppsSeed));
      }
    } catch (e) {
      setApplications(initialAppsSeed);
    }
  }, []);

  // Utility helper to persist projects state
  const saveProjectsToStorage = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('devsnapz_projects', JSON.stringify(updatedProjects));
  };

  // Utility helper to persist applications state
  const saveApplicationsToStorage = (updatedApps: CollaboratorApplication[]) => {
    setApplications(updatedApps);
    localStorage.setItem('devsnapz_applications', JSON.stringify(updatedApps));
  };

  // Callback: Add new project from creation wizard
  const handleAddProject = (newProject: Project) => {
    const updated = [newProject, ...projects];
    saveProjectsToStorage(updated);
    setShowCreateWizard(false);
    navigate(`/projects/${newProject.id}`);
  };

  // Callback: Submit collaborator application
  const handleApplyToCollaborate = (application: {
    projectId: string;
    roleName: string;
    applicantName: string;
    applicantEmail: string;
    skills: string;
    message: string;
  }) => {
    const targetProject = projects.find((p) => p.id === application.projectId);
    const newApp: CollaboratorApplication = {
      id: `app-${Date.now()}`,
      projectId: application.projectId,
      projectTitle: targetProject ? targetProject.title : 'Project Showcase',
      roleName: application.roleName,
      applicantName: application.applicantName,
      applicantEmail: application.applicantEmail,
      skills: application.skills,
      message: application.message,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    };

    const updated = [newApp, ...applications];
    saveApplicationsToStorage(updated);
  };

  // Callback: Approve collaborator application
  const handleApproveApplication = (appId: string) => {
    const updatedApps = applications.map((app) =>
      app.id === appId ? { ...app, status: 'approved' as const } : app
    );
    saveApplicationsToStorage(updatedApps);

    // Mark corresponding role in project as filled
    const targetApp = applications.find((a) => a.id === appId);
    if (targetApp) {
      const updatedProjects = projects.map((p) => {
        if (p.id === targetApp.projectId && p.openRoles) {
          const updatedRoles = p.openRoles.map((r) =>
            r.roleName === targetApp.roleName ? { ...r, status: 'filled' as const } : r
          );
          return { ...p, openRoles: updatedRoles };
        }
        return p;
      });
      saveProjectsToStorage(updatedProjects);
    }
  };

  // Callback: Decline collaborator application
  const handleDeclineApplication = (appId: string) => {
    const updatedApps = applications.map((app) =>
      app.id === appId ? { ...app, status: 'declined' as const } : app
    );
    saveApplicationsToStorage(updatedApps);
  };

  // Callback: Sponsor a project
  const handleSponsorProject = (sponsorship: {
    projectId: string;
    amount: number;
    sponsorName: string;
    message: string;
  }) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === sponsorship.projectId) {
        const sponsorsList = p.sponsorsList || [];
        const updatedSponsors = [
          {
            name: sponsorship.sponsorName,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(sponsorship.sponsorName)}`,
            amount: sponsorship.amount,
            message: sponsorship.message || undefined,
            sponsoredAt: new Date().toISOString(),
          },
          ...sponsorsList,
        ];
        return {
          ...p,
          fundingRaised: (p.fundingRaised || 0) + sponsorship.amount,
          sponsorsList: updatedSponsors,
        };
      }
      return p;
    });

    saveProjectsToStorage(updatedProjects);
  };

  // Callback: Ask new guidance question
  const handleAddGuidanceTopic = (projectId: string, question: string) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        const topics = p.guidanceTopics || [];
        const newTopic: GuidanceTopic = {
          id: `g-${Date.now()}`,
          question,
          askedBy: 'Anonymous Dev',
          askedAt: new Date().toISOString(),
          replies: [],
        };
        return { ...p, guidanceTopics: [newTopic, ...topics] };
      }
      return p;
    });

    saveProjectsToStorage(updatedProjects);
  };

  // Callback: Post answer reply to guidance topic
  const handleReplyToGuidance = (projectId: string, topicId: string, replyText: string, isCreatorResponse: boolean = false) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId && p.guidanceTopics) {
        const updatedTopics = p.guidanceTopics.map((topic) => {
          if (topic.id === topicId) {
            const replies = topic.replies || [];
            const newReply = {
              id: `r-${Date.now()}`,
              repliedBy: isCreatorResponse ? p.creatorName : 'Technical Guide',
              replyText,
              repliedAt: new Date().toISOString(),
              isCreator: isCreatorResponse,
            };
            return { ...topic, replies: [...replies, newReply] };
          }
          return topic;
        });
        return { ...p, guidanceTopics: updatedTopics };
      }
      return p;
    });

    saveProjectsToStorage(updatedProjects);
  };

  // Callback: Claim recommended issue
  const handleClaimIssue = (projectId: string, issueId: string) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId && p.contributeIssues) {
        const updatedIssues = p.contributeIssues.map((issue) =>
          issue.id === issueId ? { ...issue, status: 'claimed' as const } : issue
        );
        return { ...p, contributeIssues: updatedIssues };
      }
      return p;
    });

    saveProjectsToStorage(updatedProjects);
  };

  // Callback: Close issue
  const handleCloseIssue = (projectId: string, issueId: string) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId && p.contributeIssues) {
        const updatedIssues = p.contributeIssues.map((issue) =>
          issue.id === issueId ? { ...issue, status: 'merged' as const } : issue
        );
        return { ...p, contributeIssues: updatedIssues };
      }
      return p;
    });

    saveProjectsToStorage(updatedProjects);
  };

  const pendingAppsCount = applications.filter((app) => app.status === 'pending').length;

  return (
    <div className="min-h-screen font-dmsans text-ink0 bg-bg0 relative flex flex-col justify-between">
      {/* Noise background overlays */}
      <div className="glow-orb" />
      <div className="glow-orb2" />

      {/* Navigation bar */}
      <Nav
        onOpenCreateWizard={() => setShowCreateWizard(true)}
        pendingNotifications={pendingAppsCount}
      />

      <main className="flex-grow pt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/explore"
            element={
              <ExplorePage
                projects={projects}
                onOpenCreateWizard={() => setShowCreateWizard(true)}
              />
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProjectDetailPage
                projects={projects}
                onApplyToCollaborate={handleApplyToCollaborate}
                onSponsorProject={handleSponsorProject}
                onAddGuidanceTopic={handleAddGuidanceTopic}
                onReplyToGuidance={(pId, tId, rTxt) => handleReplyToGuidance(pId, tId, rTxt, false)}
                onClaimIssue={handleClaimIssue}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                projects={projects}
                applications={applications}
                onApproveApplication={handleApproveApplication}
                onDeclineApplication={handleDeclineApplication}
                onReplyToGuidance={(pId, tId, rTxt, isC) => handleReplyToGuidance(pId, tId, rTxt, isC)}
                onCloseIssue={handleCloseIssue}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <ProfilePage
                projects={projects}
                applications={applications}
                onOpenCreateWizard={() => setShowCreateWizard(true)}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Showcase creation form overlay */}
      {showCreateWizard && (
        <CreateProjectWizard
          onClose={() => setShowCreateWizard(false)}
          onSubmit={handleAddProject}
        />
      )}
    </div>
  );
}
