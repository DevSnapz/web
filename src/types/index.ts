export interface OpenRole {
  id: string;
  roleName: string;
  description: string;
  skillsNeeded: string[];
  status: 'open' | 'filled';
}

export interface SponsorshipTier {
  id: string;
  name: string;
  amount: number;
  benefits: string;
}

export interface Sponsor {
  name: string;
  avatar: string;
  amount: number;
  message?: string;
  sponsoredAt: string;
}

export interface GuidanceReply {
  id: string;
  repliedBy: string;
  replyText: string;
  repliedAt: string;
  isCreator?: boolean;
}

export interface GuidanceTopic {
  id: string;
  question: string;
  askedBy: string;
  askedAt: string;
  replies: GuidanceReply[];
}

export interface ContributeIssue {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  link: string;
  status: 'open' | 'claimed' | 'merged';
}

export interface CollaboratorApplication {
  id: string;
  projectId: string;
  projectTitle: string;
  roleName: string;
  applicantName: string;
  applicantEmail: string;
  skills: string;
  message: string;
  status: 'pending' | 'approved' | 'declined';
  appliedAt: string;
}

export interface Project {
  id: string;
  title: string;
  pitch: string;
  description: string;
  creatorName: string;
  creatorAvatar: string;
  creatorGithub?: string;
  bannerGradient: string; // CSS gradient class or string
  icon?: string;
  category?: 'Web Development' | 'AI / ML' | 'Open Source' | 'Mobile' | 'Other';
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  fundingGoal?: number;
  fundingRaised?: number;
  helpNeeded: {
    sponsor: boolean;
    collaborate: boolean;
    guide: boolean;
    contribute: boolean;
  };
  openRoles?: OpenRole[];
  sponsorshipTiers?: SponsorshipTier[];
  sponsorsList?: Sponsor[];
  guidanceTopics?: GuidanceTopic[];
  contributeIssues?: ContributeIssue[];
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
  read: boolean;
}
