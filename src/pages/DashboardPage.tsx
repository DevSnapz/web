import React from 'react';
import CreatorDashboard from '../components/CreatorDashboard';
import { Project, CollaboratorApplication } from '../types';

interface DashboardPageProps {
  projects: Project[];
  applications: CollaboratorApplication[];
  onApproveApplication: (appId: string) => void;
  onDeclineApplication: (appId: string) => void;
  onReplyToGuidance: (projectId: string, topicId: string, replyText: string, isCreator: boolean) => void;
  onCloseIssue: (projectId: string, issueId: string) => void;
}

export default function DashboardPage({
  projects,
  applications,
  onApproveApplication,
  onDeclineApplication,
  onReplyToGuidance,
  onCloseIssue,
}: DashboardPageProps) {
  return (
    <CreatorDashboard
      projects={projects}
      applications={applications}
      onApproveApplication={onApproveApplication}
      onDeclineApplication={onDeclineApplication}
      onReplyToGuidance={onReplyToGuidance}
      onCloseIssue={onCloseIssue}
    />
  );
}
