import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';

interface ShowcaseFeedProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenCreateWizard: () => void;
}

type FilterOption = 'All' | 'Web' | 'AI / ML' | 'Open Gaps';

export default function ShowcaseFeed({
  projects,
  onOpenCreateWizard,
}: ShowcaseFeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('All');
  const [starredMap, setStarredMap] = useState<Record<string, boolean>>({});

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.pitch.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.techStack.some((t) => t.toLowerCase().includes(q)) ||
        project.openRoles?.some((r) =>
          r.roleName.toLowerCase().includes(q) ||
          r.skillsNeeded.some((s) => s.toLowerCase().includes(q))
        );

      let matchesFilter = true;
      if (selectedFilter === 'Web') {
        matchesFilter =
          project.category === 'Web Development' ||
          project.techStack.some((t) => ['React', 'JavaScript', 'Node.js', 'PostgreSQL', 'HTML', 'CSS', 'TailwindCSS'].includes(t));
      } else if (selectedFilter === 'AI / ML') {
        matchesFilter =
          project.category === 'AI / ML' ||
          project.techStack.some((t) => ['Python', 'Machine Learning', 'PyTorch', 'ONNX', 'FastAPI', 'Vector DB', 'OpenAI API'].includes(t));
      } else if (selectedFilter === 'Open Gaps') {
        matchesFilter = (project.openRoles?.some((r) => r.status === 'open') ?? false) || project.helpNeeded.collaborate;
      }

      return matchesSearch && matchesFilter;
    });
  }, [projects, searchQuery, selectedFilter]);

  const toggleStar = (projectId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setStarredMap((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const getLanguageColor = (tech: string) => {
    const t = tech.toLowerCase();
    if (t.includes('type') || t.includes('ts')) return '#3178c6';
    if (t.includes('react') || t.includes('java')) return '#f1e05a';
    if (t.includes('py') || t.includes('torch')) return '#3572A5';
    if (t.includes('c++') || t.includes('c#')) return '#f34b7d';
    if (t.includes('rust')) return '#dea584';
    return '#79c0ff';
  };

  return (
    <section id="explore-feed" className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 space-y-6">
      
      {/* GitHub Repository Explorer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3d444d]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#f0f6fc]">
            Explore Student Repositories
          </h1>
          <p className="text-xs text-[#9198a1] mt-1">
            Browse repositories actively recruiting student contributors and collaborators.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateWizard}
          className="self-start sm:self-auto px-3.5 py-1.5 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>+</span>
          <span>New Repository</span>
        </button>
      </div>

      {/* GitHub-style Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        
        {/* Search input with slash shortcut */}
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find a repository or skill (e.g. React, PyTorch)..."
            className="w-full bg-[#151b23] border border-[#3d444d] rounded-md px-3 py-1.5 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff] placeholder-[#9198a1]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9198a1] hover:text-[#f0f6fc]"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#151b23] border border-[#3d444d] rounded-md p-0.5 overflow-x-auto">
          {(['All', 'Web', 'AI / ML', 'Open Gaps'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                selectedFilter === filter
                  ? 'bg-[#21262d] text-[#f0f6fc] font-semibold border border-[#3d444d]'
                  : 'text-[#9198a1] hover:text-[#f0f6fc]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

      </div>

      {/* Repository Count Notice */}
      <div className="text-xs text-[#9198a1] font-mono">
        <strong>{filteredProjects.length}</strong> results for repositories
      </div>

      {/* =================================================================== */}
      {/* GITHUB REPOSITORY LIST (Classic GitHub search / explore feed)        */}
      {/* =================================================================== */}
      <div className="border border-[#3d444d] rounded-md bg-[#151b23] divide-y divide-[#3d444d]">
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#9198a1] space-y-2">
            <div className="text-2xl">🔍</div>
            <div className="font-bold text-[#f0f6fc]">No matching repositories found</div>
            <p>Try searching for a different framework, language, or clear your query.</p>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const openGapsCount = project.openRoles?.filter((r) => r.status === 'open').length || 0;
            const isStar = !!starredMap[project.id];
            const primaryLang = project.techStack[0] || 'TypeScript';

            return (
              <div
                key={project.id}
                className="p-5 hover:bg-[#21262d]/50 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-2 max-w-3xl">
                  
                  {/* Repo Breadcrumbs: Owner / Repo-name + Public badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <svg className="w-4 h-4 fill-current text-[#9198a1]" viewBox="0 0 16 16">
                      <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                    </svg>

                    <Link
                      to={`/projects/${project.id}`}
                      className="font-bold text-base text-[#58a6ff] hover:underline"
                    >
                      {project.creatorGithub || project.creatorName.toLowerCase().replace(/\s+/g, '-')} / {project.id}
                    </Link>

                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full border border-[#3d444d] text-[#9198a1]">
                      Public
                    </span>
                  </div>

                  {/* Pitch / Description */}
                  <p className="text-[#9198a1] text-xs leading-relaxed">
                    {project.pitch}
                  </p>

                  {/* GitHub Topic Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-full bg-[rgba(56,139,253,0.15)] text-[#58a6ff] hover:bg-[#1f6feb] hover:text-white transition-colors cursor-pointer text-[11px] font-semibold"
                      >
                        {tech.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                      </span>
                    ))}
                  </div>

                  {/* Footer Meta Row (Language Dot, Stars, Forks, Updated Time, Open Skill Gaps) */}
                  <div className="flex items-center gap-4 text-[11px] text-[#9198a1] pt-2 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: getLanguageColor(primaryLang) }}
                      />
                      <span className="font-mono text-[#f0f6fc]">{primaryLang}</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <span>★</span>
                      <span>38</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <span>⑂</span>
                      <span>4</span>
                    </span>

                    <span>Updated 3 hours ago</span>

                    {openGapsCount > 0 && (
                      <span className="flex items-center gap-1 font-semibold text-[#ff7b72] bg-[rgba(248,81,73,0.15)] border border-[rgba(248,81,73,0.4)] px-2 py-0.2 rounded-full">
                        <span>⚡</span>
                        <span>{openGapsCount} Open Skill {openGapsCount === 1 ? 'Gap' : 'Gaps'}</span>
                      </span>
                    )}
                  </div>

                </div>

                {/* Right Star Button */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={(e) => toggleStar(project.id, e)}
                    className="px-3 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#3d444d] rounded-md font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span className={isStar ? 'text-[#ff7b72]' : 'text-[#9198a1]'}>★</span>
                    <span className="text-[#f0f6fc]">{isStar ? 'Starred' : 'Star'}</span>
                  </button>

                  <Link
                    to={`/projects/${project.id}`}
                    className="px-3 py-1 bg-[#1f6feb] hover:bg-[#2a7aef] text-white font-semibold rounded-md text-xs shadow-xs whitespace-nowrap"
                  >
                    View Repo ➔
                  </Link>
                </div>

              </div>
            );
          })
        )}
      </div>

    </section>
  );
}
