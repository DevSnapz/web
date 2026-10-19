import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShowcaseFeed from '../components/ShowcaseFeed';
import { Project } from '../types';

interface ExplorePageProps {
  projects: Project[];
  onOpenCreateWizard: () => void;
}

export default function ExplorePage({ projects, onOpenCreateWizard }: ExplorePageProps) {
  const navigate = useNavigate();

  const handleSelectProject = (project: Project) => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <ShowcaseFeed
      projects={projects}
      onSelectProject={handleSelectProject}
      onOpenCreateWizard={onOpenCreateWizard}
    />
  );
}
