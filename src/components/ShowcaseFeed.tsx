import React, { useState, useMemo } from 'react';
import { Project } from '../types';

interface ShowcaseFeedProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenCreateWizard: () => void;
}

type FilterOption = 'All Projects' | 'Web Development' | 'AI / ML' | 'Open to Join';

export default function ShowcaseFeed({
  projects,
  onSelectProject,
  onOpenCreateWizard,
}: ShowcaseFeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('All Projects');

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const q = searchQuery.toLowerCase().trim();

      // Text search across title, pitch, description, tech stack, and role skills
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

      // Pill filter
      let matchesFilter = true;
      if (selectedFilter === 'Web Development') {
        matchesFilter =
          project.category === 'Web Development' ||
          project.techStack.some((t) => ['React', 'JavaScript', 'Node.js', 'PostgreSQL', 'HTML', 'CSS', 'TailwindCSS'].includes(t));
      } else if (selectedFilter === 'AI / ML') {
        matchesFilter =
          project.category === 'AI / ML' ||
          project.techStack.some((t) => ['Python', 'Machine Learning', 'PyTorch', 'ONNX', 'FastAPI', 'Vector DB', 'OpenAI API'].includes(t));
      } else if (selectedFilter === 'Open to Join') {
        matchesFilter = (project.openRoles?.some((r) => r.status === 'open') ?? false) || project.helpNeeded.collaborate;
      }

      return matchesSearch && matchesFilter;
    });
  }, [projects, searchQuery, selectedFilter]);

  const filterOptions: FilterOption[] = [
    'All Projects',
    'Web Development',
    'AI / ML',
    'Open to Join',
  ];

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedFilter('All Projects');
  };

  const getProjectIcon = (project: Project) => {
    if (project.icon) return project.icon;
    if (project.title.toLowerCase().includes('recycle') || project.title.toLowerCase().includes('eco')) return '♻️';
    if (project.title.toLowerCase().includes('ai') || project.title.toLowerCase().includes('study')) return '🧠';
    if (project.title.toLowerCase().includes('farm') || project.title.toLowerCase().includes('agri')) return '🌱';
    return '⚡';
  };

  return (
    <section id="explore-feed" className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            Explore projects
          </h1>
          <p className="text-[#6B7280] text-sm sm:text-base mt-1.5">
            Discover ideas worth building and teams looking for contributors.
          </p>
        </div>

        <button
          onClick={onOpenCreateWizard}
          className="self-start sm:self-auto font-sans text-xs font-semibold bg-[#635BFF] hover:bg-[#5246C9] text-white px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
        >
          <span>+</span>
          <span>Publish Project</span>
        </button>
      </div>

      {/* Large White Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9CA3AF]">
          <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search projects, skills, or topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-10 py-3.5 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder-[#9CA3AF] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#635BFF]/25 focus:border-[#635BFF] transition-all font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9CA3AF] hover:text-[#111827]"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Pill-Shaped Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterOptions.map((opt) => {
          const isSelected = selectedFilter === opt;
          return (
            <button
              key={opt}
              onClick={() => setSelectedFilter(opt)}
              className={`px-4 py-1.5 rounded-full text-xs font-sans whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-[#F3F1FF] border-[#635BFF] text-[#635BFF] font-semibold shadow-xs'
                  : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FC]'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Project Cards Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm my-8">
          <div className="w-12 h-12 rounded-xl bg-[#F3F1FF] text-[#635BFF] flex items-center justify-center mx-auto mb-3 text-lg font-bold">
            🔍
          </div>
          <h3 className="font-bold text-base text-[#111827] mb-1">No projects found</h3>
          <p className="text-xs text-[#6B7280] mb-5 leading-relaxed">
            {searchQuery
              ? `No projects matched "${searchQuery}". Try adjusting your keywords or clearing filters.`
              : 'No projects match this filter selection.'}
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#635BFF] hover:bg-[#5246C9] text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const openRoles = project.openRoles?.filter((r) => r.status === 'open') || [];
            const primaryRole = openRoles[0]?.roleName || 'Contributors';
            const icon = getProjectIcon(project);

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-[#635BFF]/40 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Top Icon & Status Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F3F1FF] text-[#635BFF] flex items-center justify-center text-lg font-bold">
                      {icon}
                    </div>
                    <span className="text-xs font-medium text-[#17936C] bg-[#ECFDF5] border border-[#17936C]/20 px-2.5 py-0.5 rounded-full">
                      Open to join
                    </span>
                  </div>

                  {/* Project Title */}
                  <h3 className="font-bold text-base text-[#111827] group-hover:text-[#635BFF] transition-colors mb-1.5">
                    {project.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs text-[#6B7280] leading-relaxed min-h-[36px] line-clamp-2">
                    {project.pitch}
                  </p>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5 my-4">
                    {project.techStack.map((tag) => (
                      <span
                        key={tag}
                        className="text-[0.7rem] font-mono bg-[#F3F1FF] text-[#635BFF] border border-[#635BFF]/20 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Divider & Footer: Needed Role + View Project Link */}
                <div className="pt-3.5 border-t border-[#E5E7EB] flex items-center justify-between text-xs mt-auto">
                  <span className="text-[#111827] font-medium truncate max-w-[190px]">
                    Looking for: <span className="text-[#6B7280]">{primaryRole}</span>
                  </span>
                  <span className="font-semibold text-[#635BFF] group-hover:text-[#5246C9] flex items-center gap-0.5 whitespace-nowrap">
                    View project ↗
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
