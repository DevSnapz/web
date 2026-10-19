import { Project } from '../types';

export const initialProjects: Project[] = [
  // EXACT SAMPLE CARD 1 (from Section 5 Specification)
  {
    id: 'campus-recycling',
    title: 'Campus Recycling App',
    pitch: 'Build a smarter recycling experience for college campuses.',
    description: 'A student project looking for the right people to make an environmental impact by streamlining campus recycling, waste audit telemetry, and student eco-rewards.',
    creatorName: 'Maya Patel',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    creatorGithub: 'mayapatel',
    bannerGradient: 'from-emerald-500 via-teal-600 to-cyan-600',
    icon: '♻️',
    category: 'Web Development',
    techStack: ['React', 'PostgreSQL'],
    githubUrl: 'https://github.com/devsnapz/campus-recycling',
    liveUrl: 'https://recycling.campus.devsnapz.org',
    fundingGoal: 1000,
    fundingRaised: 300,
    helpNeeded: {
      sponsor: false,
      collaborate: true,
      guide: true,
      contribute: true,
    },
    openRoles: [
      {
        id: 'role-rec-1',
        roleName: 'UI/UX Designer',
        description: 'Design intuitive recycling bin locator maps, progress stats, and gamified student sorting dashboards.',
        skillsNeeded: ['UI/UX', 'Figma', 'React'],
        status: 'open',
      }
    ],
    sponsorshipTiers: [],
    sponsorsList: [],
    guidanceTopics: [
      {
        id: 'guide-rec-1',
        question: 'What is the most accessible color scheme for bin fill-level status indicators?',
        askedBy: 'Maya Patel',
        askedAt: '2026-09-10T11:00:00Z',
        replies: []
      }
    ],
    contributeIssues: [
      {
        id: 'issue-rec-1',
        title: 'Add campus dorm building dropdown filter',
        difficulty: 'easy',
        link: 'https://github.com/devsnapz/campus-recycling/issues/1',
        status: 'open',
      }
    ]
  },

  // EXACT SAMPLE CARD 2 (from Section 5 Specification)
  {
    id: 'studymate-ai',
    title: 'StudyMate AI',
    pitch: 'Personalized study planning for students.',
    description: 'An intelligent study scheduling and spaced repetition assistant that adapts study sessions according to upcoming exam dates, course syllabi, and student cognitive performance.',
    creatorName: 'David Miller',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    creatorGithub: 'davidmiller-dev',
    bannerGradient: 'from-indigo-600 via-purple-600 to-pink-600',
    icon: '🧠',
    category: 'AI / ML',
    techStack: ['Python', 'Machine Learning', 'FastAPI', 'React'],
    githubUrl: 'https://github.com/devsnapz/studymate-ai',
    liveUrl: 'https://studymate.devsnapz.org',
    fundingGoal: 2500,
    fundingRaised: 750,
    helpNeeded: {
      sponsor: false,
      collaborate: true,
      guide: true,
      contribute: true,
    },
    openRoles: [
      {
        id: 'role-sm-1',
        roleName: 'Frontend Developer',
        description: 'Implement reactive schedule calendars, drag-and-drop revision blocks, and progress analytics.',
        skillsNeeded: ['React', 'TypeScript', 'TailwindCSS'],
        status: 'open',
      }
    ],
    sponsorshipTiers: [],
    sponsorsList: [],
    guidanceTopics: [
      {
        id: 'guide-sm-1',
        question: 'How to handle timezone conversions accurately when sharing study calendars across student cohorts?',
        askedBy: 'David Miller',
        askedAt: '2026-09-12T14:30:00Z',
        replies: []
      }
    ],
    contributeIssues: [
      {
        id: 'issue-sm-1',
        title: 'Add daily focus streak counter widget',
        difficulty: 'easy',
        link: 'https://github.com/devsnapz/studymate-ai/issues/3',
        status: 'open',
      }
    ]
  },

  // EXACT SAMPLE CARD 3 (from Section 5 Specification)
  {
    id: 'openfarm',
    title: 'OpenFarm',
    pitch: 'An open platform for smarter agricultural insights.',
    description: 'An open platform connecting small-scale agricultural cooperatives with micro-climate models, soil telemetry, and predictive harvest analytics.',
    creatorName: 'Sana Patel',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    creatorGithub: 'sanapatel-agri',
    bannerGradient: 'from-emerald-600 via-green-600 to-teal-700',
    icon: '🌱',
    category: 'Web Development',
    techStack: ['JavaScript', 'Data', 'Node.js', 'PostgreSQL'],
    githubUrl: 'https://github.com/devsnapz/openfarm',
    liveUrl: 'https://openfarm.devsnapz.org',
    fundingGoal: 1500,
    fundingRaised: 420,
    helpNeeded: {
      sponsor: true,
      collaborate: true,
      guide: false,
      contribute: true,
    },
    openRoles: [
      {
        id: 'role-of-1',
        roleName: 'Backend Developer',
        description: 'Design high-throughput ingestion pipelines for sensor data and spatial telemetry queries.',
        skillsNeeded: ['JavaScript', 'Data', 'Node.js', 'PostgreSQL'],
        status: 'open',
      }
    ],
    sponsorshipTiers: [],
    sponsorsList: [],
    guidanceTopics: [],
    contributeIssues: [
      {
        id: 'issue-of-1',
        title: 'Add CSV telemetry exporter for researchers',
        difficulty: 'medium',
        link: 'https://github.com/devsnapz/openfarm/issues/8',
        status: 'open',
      }
    ]
  },

  // Verified Archetype: AiVerse
  {
    id: 'ai-verse',
    title: 'AiVerse',
    pitch: 'A generative sandbox for running multi-agent simulations in the browser.',
    description: 'AiVerse is an open-source playground where developers can spin up autonomous LLM-powered agents that interact with each other in a virtual canvas.',
    creatorName: 'Frozen',
    creatorAvatar: 'https://avatars.githubusercontent.com/u/174297688?s=96&v=4',
    creatorGithub: 'Frozen-47',
    bannerGradient: 'from-indigo-600 via-purple-600 to-pink-600',
    icon: '⚡',
    category: 'AI / ML',
    techStack: ['React', 'TypeScript', 'Node.js', 'Vector DB', 'OpenAI API'],
    githubUrl: 'https://github.com/Frozen-47/AiVerse',
    liveUrl: 'https://aiverse.frozenn.in',
    fundingGoal: 2000,
    fundingRaised: 450,
    helpNeeded: {
      sponsor: true,
      collaborate: true,
      guide: true,
      contribute: true,
    },
    openRoles: [
      {
        id: 'role-1',
        roleName: 'Frontend Engineer (Canvas/Motion)',
        description: 'Need help building the interactive agent grid visualizer and custom canvas dragging controls.',
        skillsNeeded: ['React', 'Framer Motion', 'Canvas API'],
        status: 'open',
      }
    ],
    sponsorshipTiers: [],
    sponsorsList: [],
    guidanceTopics: [],
    contributeIssues: []
  },

  // Verified Archetype: Campus EcoSync
  {
    id: 'campus-ecosync',
    title: 'Campus EcoSync',
    pitch: 'Smart IoT and Edge telemetry system monitoring dormitory energy waste and recycling loads.',
    description: 'EcoSync pairs low-cost ESP32 microcontrollers with ultrasonic sensors and power-metering clamps across campus buildings.',
    creatorName: 'Ananya Sharma',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    creatorGithub: 'ananya-sharma',
    bannerGradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    icon: '📡',
    category: 'Web Development',
    techStack: ['C++', 'ESP32', 'Python', 'MQTT', 'TimescaleDB'],
    githubUrl: 'https://github.com/devsnapz/campus-ecosync',
    liveUrl: 'https://ecosync.campus.devsnapz.org',
    fundingGoal: 1500,
    fundingRaised: 620,
    helpNeeded: {
      sponsor: false,
      collaborate: true,
      guide: true,
      contribute: true,
    },
    openRoles: [
      {
        id: 'role-eco-1',
        roleName: 'Embedded Firmware Developer',
        description: 'Need expertise in FreeRTOS and low-power deep sleep cycles on ESP32 boards.',
        skillsNeeded: ['C++', 'ESP32', 'FreeRTOS'],
        status: 'open',
      }
    ],
    sponsorshipTiers: [],
    sponsorsList: [],
    guidanceTopics: [],
    contributeIssues: []
  },

  // Verified Archetype: MedVision-AI
  {
    id: 'medvision-ai',
    title: 'MedVision-AI',
    pitch: 'Open-access federated computer vision tool for student pulmonary X-ray analysis.',
    description: 'MedVision-AI allows bio-engineering and computer science students to train chest X-ray segmentation models without centralizing patient scans.',
    creatorName: 'Rohan Verma',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    creatorGithub: 'rohan-verma-ml',
    bannerGradient: 'from-blue-600 via-indigo-600 to-violet-700',
    icon: '🔬',
    category: 'AI / ML',
    techStack: ['Python', 'PyTorch', 'ONNX', 'FastAPI', 'React'],
    githubUrl: 'https://github.com/devsnapz/medvision-ai',
    liveUrl: 'https://medvision.devsnapz.org',
    fundingGoal: 3000,
    fundingRaised: 1100,
    helpNeeded: {
      sponsor: true,
      collaborate: true,
      guide: true,
      contribute: false,
    },
    openRoles: [
      {
        id: 'role-med-1',
        roleName: 'Deep Learning / Vision Researcher',
        description: 'Optimize U-Net backbone for real-time mobile segmentation and reduce inference latency.',
        skillsNeeded: ['PyTorch', 'Computer Vision', 'ONNX Runtime'],
        status: 'open',
      }
    ],
    sponsorshipTiers: [],
    sponsorsList: [],
    guidanceTopics: [],
    contributeIssues: []
  }
];
