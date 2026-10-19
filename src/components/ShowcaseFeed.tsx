import React, { useState, useMemo } from 'react';
import { Project } from '../types';

interface ShowcaseFeedProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenCreateWizard: () => void;
}

export default function ShowcaseFeed({ projects, onSelectProject, onOpenCreateWizard }: ShowcaseFeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'collaborate' | 'guide' | 'contribute' | 'sponsor'>('all');

  // Extract all unique tech stack tags from all projects
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((p) => p.techStack.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search matching across title, pitch, description, tech stack, and role skills
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

      // Role filter
      const matchesRole =
        roleFilter === 'all' ||
        (roleFilter === 'collaborate' && project.helpNeeded.collaborate) ||
        (roleFilter === 'guide' && project.helpNeeded.guide) ||
        (roleFilter === 'contribute' && project.helpNeeded.contribute) ||
        (roleFilter === 'sponsor' && project.helpNeeded.sponsor);

      // Category filter (by technology tag)
      const matchesCategory =
        selectedCategory === 'all' || project.techStack.includes(selectedCategory);

      return matchesSearch && matchesRole && matchesCategory;
    });
  }, [projects, searchQuery, roleFilter, selectedCategory]);

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || roleFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setRoleFilter('all');
  };

  return (
    <section id="showcase-feed" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      {/* Header & Primary CTA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-[#222F4C]/60">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#635BFF]/10 border border-[#635BFF]/30 text-[#9D98FF] text-xs font-mono tracking-wider uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" />
            Student Innovation Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Find your next team. <br className="hidden sm:inline" />
            Bridge missing skills.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2.5 leading-relaxed">
            Explore student-led projects, hackathon initiatives, and research builds. Filter by tech stack, open roles, or skill gaps to find where your talents make an impact.
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={onOpenCreateWizard}
            className="group relative overflow-hidden bg-[#635BFF] hover:bg-[#5249e0] text-white font-medium px-5 py-3 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-[#635BFF]/25 hover:shadow-[#635BFF]/40 transition-all duration-200 active:scale-95"
          >
            <svg className="w-4 h-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Publish Project Idea</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#151B2D]/80 border border-[#222F4C] rounded-2xl p-4 sm:p-5 mb-8 backdrop-blur-md shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Search box */}
          <div className="md:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search title, stack, or missing skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-[#0B1020]/70 border border-[#222F4C] rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF]/40 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                title="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Tech stack dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0B1020]/70 border border-[#222F4C] rounded-xl text-sm text-white focus:outline-none focus:border-[#635BFF] transition-all font-sans cursor-pointer"
            >
              <option value="all">All Tech Stacks ({allTags.length})</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag} className="bg-[#151B2D] text-white">
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Role Status Filter Pills */}
          <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'collaborate', label: 'Teammates' },
              { id: 'guide', label: 'Mentors' },
              { id: 'contribute', label: 'Issues' },
              { id: 'sponsor', label: 'Sponsors' },
            ].map((tab) => {
              const active = roleFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setRoleFilter(tab.id as typeof roleFilter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    active
                      ? 'bg-[#635BFF] text-white shadow-md shadow-[#635BFF]/30'
                      : 'bg-[#0B1020]/60 text-slate-300 hover:text-white hover:bg-[#0B1020] border border-[#222F4C]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter status strip */}
        <div className="mt-3.5 pt-3 border-t border-[#222F4C]/50 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-white font-medium">{filteredProjects.length}</strong> of{' '}
              <strong className="text-white font-medium">{projects.length}</strong> student projects
            </span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#635BFF]/15 text-[#9D98FF] font-mono text-[0.68rem] border border-[#635BFF]/30">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('all')} className="hover:text-white ml-0.5">×</button>
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[#F9735B] hover:text-[#ff8f79] font-medium transition-colors flex items-center gap-1"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Grid listing */}
      {filteredProjects.length === 0 ? (
        <div className="bg-[#151B2D]/80 border border-[#222F4C] rounded-2xl p-12 text-center max-w-lg mx-auto my-12">
          <div className="w-14 h-14 rounded-2xl bg-[#0B1020] border border-[#222F4C] flex items-center justify-center mx-auto mb-4 text-slate-400">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3 className="font-bold text-lg text-white mb-1.5">No projects found</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            {searchQuery
              ? `No projects matched "${searchQuery}". Try different keywords or reset your filters.`
              : 'No projects match your active filter combinations.'}
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#635BFF] hover:bg-[#5249e0] text-white rounded-xl text-xs font-semibold shadow-md shadow-[#635BFF]/25 transition-all"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const openRolesList = project.openRoles?.filter((r) => r.status === 'open') || [];
            const primaryRole = openRolesList[0];

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group cursor-pointer bg-[#151B2D]/90 hover:bg-[#151B2D] border border-[#222F4C] hover:border-[#635BFF]/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#635BFF]/10 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
              >
                {/* Colored banner header */}
                <div className={`h-24 bg-gradient-to-r ${project.bannerGradient} relative p-4 flex justify-between items-start`}>
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
                  
                  {/* Status tag */}
                  <span className="relative z-10 px-2 py-0.5 rounded-full text-[0.62rem] font-mono uppercase tracking-wider bg-[#0B1020]/80 text-white border border-white/10 backdrop-blur-sm">
                    {project.helpNeeded.collaborate ? 'Seeking Teammates' : 'Active Build'}
                  </span>

                  {/* Open roles counter if any */}
                  {openRolesList.length > 0 && (
                    <span className="relative z-10 px-2 py-0.5 rounded-full text-[0.62rem] font-semibold bg-[#F9735B] text-white shadow-sm">
                      {openRolesList.length} open role{openRolesList.length > 1 ? 's' : ''}
                    </span>
                  )}

                  {/* Creator Avatar & Handle */}
                  <div className="absolute -bottom-5 left-5 flex items-center gap-2.5 z-10">
                    <img
                      src={project.creatorAvatar}
                      alt={project.creatorName}
                      className="w-10 h-10 rounded-full ring-4 ring-[#151B2D] object-cover shadow-md bg-[#0B1020]"
                    />
                    <div className="bg-[#0B1020]/90 border border-[#222F4C] rounded-md px-2 py-0.5 text-[0.62rem] font-mono text-slate-300 shadow-sm">
                      @{project.creatorGithub || project.creatorName.split(' ')[0].toLowerCase()}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-8 flex-grow flex flex-col">
                  {/* Title and Short Pitch */}
                  <div className="mb-3">
                    <h3 className="font-bold text-lg text-white group-hover:text-[#635BFF] transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed min-h-[32px]">
                      {project.pitch}
                    </p>
                  </div>

                  {/* Skill-Gap Highlight Callout */}
                  {primaryRole ? (
                    <div className="mb-4 p-2.5 rounded-xl bg-[#0B1020]/60 border border-[#222F4C] group-hover:border-[#635BFF]/30 transition-colors">
                      <div className="flex items-center justify-between text-[0.65rem] text-slate-400 mb-1 font-mono">
                        <span className="flex items-center gap-1.5 text-[#F9735B] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F9735B] animate-pulse" />
                          SEEKING TALENT
                        </span>
                        <span className="text-slate-400 truncate max-w-[120px]">{primaryRole.roleName}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {primaryRole.skillsNeeded.map((skill) => (
                          <span
                            key={skill}
                            className="text-[0.62rem] px-1.5 py-0.5 rounded bg-[#635BFF]/15 text-[#9D98FF] border border-[#635BFF]/25 font-mono"
                          >
                            +{skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 p-2.5 rounded-xl bg-[#0B1020]/30 border border-[#222F4C]/50 text-[0.7rem] text-slate-400 italic">
                      Core team formed · Open to community issues & mentorship
                    </div>
                  )}

                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-1 mb-4 flex-grow content-start">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[0.68rem] font-mono bg-[#0B1020]/60 border border-[#222F4C] px-2 py-0.5 rounded text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Card Footer: Metadata & Action Link */}
                  <div className="flex items-center justify-between text-[0.72rem] text-slate-400 pt-3 border-t border-[#222F4C]/70 mt-auto">
                    <div className="flex items-center gap-3">
                      {project.helpNeeded.guide && (
                        <span className="flex items-center gap-1 text-purple-400">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Mentors
                        </span>
                      )}
                      {project.helpNeeded.contribute && (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          Issues
                        </span>
                      )}
                    </div>
                    <span className="text-[#635BFF] group-hover:text-[#817AFF] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-all">
                      Explore Hub ➔
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
