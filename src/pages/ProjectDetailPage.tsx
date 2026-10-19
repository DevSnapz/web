import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProjectDetailModal from '../components/ProjectDetailModal';
import { Project } from '../types';

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

export default function ProjectDetailPage({
  projects,
  onApplyToCollaborate,
  onSponsorProject,
  onAddGuidanceTopic,
  onReplyToGuidance,
  onClaimIssue,
}: ProjectDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-20 text-center">
        <div className="bg-bg1 border border-ink3 rounded-xl p-12 max-w-md mx-auto">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="font-outfit font-extrabold text-2xl text-ink0 mb-2">Project Not Found</h2>
          <p className="text-sm text-ink1 mb-6">
            The project you are looking for may have been removed or does not exist.
          </p>
          <Link
            to="/explore"
            className="bg-g text-bg0 font-semibold px-5 py-2.5 rounded-lg text-xs font-dmmono inline-flex items-center gap-2 hover:shadow-[0_0_15px_rgba(27,206,146,0.3)]"
          >
            ← Back to Showcase Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProjectDetailModal
      project={project}
      onClose={() => navigate('/explore')}
      onApplyToCollaborate={onApplyToCollaborate}
      onSponsorProject={onSponsorProject}
      onAddGuidanceTopic={onAddGuidanceTopic}
      onReplyToGuidance={onReplyToGuidance}
      onClaimIssue={onClaimIssue}
    />
  );
}
