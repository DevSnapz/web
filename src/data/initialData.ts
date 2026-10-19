import { Project } from '../types';

export const initialProjects: Project[] = [
  {
    id: 'ai-verse',
    title: 'AiVerse',
    pitch: 'A generative sandbox for running multi-agent simulations in the browser.',
    description: 'AiVerse is an open-source playground where developers can spin up dozens of autonomous LLM-powered agents that interact with each other in a virtual environment. It supports custom system prompts, vector memory storage, and real-time visualization of agent conversations and action paths.',
    creatorName: 'Frozen',
    creatorAvatar: 'https://avatars.githubusercontent.com/u/174297688?s=96&v=4',
    creatorGithub: 'Frozen-47',
    bannerGradient: 'from-indigo-600 via-purple-600 to-pink-600',
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
      },
      {
        id: 'role-2',
        roleName: 'Backend Vector DB Architect',
        description: 'Help optimize context retrieval queries and integrate lightweight vector search inside local storage/Dexie.',
        skillsNeeded: ['TypeScript', 'Vector Search', 'WebWorkers'],
        status: 'open',
      }
    ],
    sponsorshipTiers: [
      {
        id: 'tier-1',
        name: 'Coffee Sponsor',
        amount: 10,
        benefits: 'Get a sponsor badge on GitHub and your name in the README.',
      },
      {
        id: 'tier-2',
        name: 'Server Support',
        amount: 50,
        benefits: 'Covers GPU sandbox hosting. Featured project logo on our live demo.',
      },
      {
        id: 'tier-3',
        name: 'Enterprise Supporter',
        amount: 250,
        benefits: 'Priority support, feature steering input, and premium logo placement.',
      }
    ],
    sponsorsList: [],
    guidanceTopics: [
      {
        id: 'guide-1',
        question: 'What is the optimal chunk size for agent conversation summaries to prevent context window bloat?',
        askedBy: 'Frozen',
        askedAt: '2026-06-11T14:22:00Z',
        replies: [
          {
            id: 'reply-1',
            repliedBy: 'Dr. Nexus',
            replyText: 'Usually 200-400 tokens works best for short dialogue memory. You should also run a summarizer LLM on top of old conversations to convert them into facts, rather than feeding raw dialogue transcripts.',
            repliedAt: '2026-06-11T16:45:00Z',
          },
          {
            id: 'reply-2',
            repliedBy: 'Frozen',
            replyText: 'Thanks! Implementing fact-based extraction instead of sliding raw context windows.',
            repliedAt: '2026-06-11T18:10:00Z',
            isCreator: true,
          }
        ]
      },
      {
        id: 'guide-2',
        question: 'Should we run local embeddings using Transformers.js directly in WebWorkers, or fall back to OpenAI API?',
        askedBy: 'Frozen',
        askedAt: '2026-06-12T10:05:00Z',
        replies: []
      }
    ],
    contributeIssues: [
      {
        id: 'issue-1',
        title: 'Add custom agent color profile selector in settings panel',
        difficulty: 'easy',
        link: 'https://github.com/Frozen-47/ai-verse/issues/12',
        status: 'open',
      },
      {
        id: 'issue-2',
        title: 'Optimize memory indexing query using local DB indexes',
        difficulty: 'medium',
        link: 'https://github.com/Frozen-47/ai-verse/issues/18',
        status: 'open',
      }
    ]
  },
  {
    id: 'campus-ecosync',
    title: 'Campus EcoSync',
    pitch: 'Smart IoT and Edge telemetry system monitoring dormitory energy waste and recycling loads.',
    description: 'EcoSync pairs low-cost ESP32 microcontrollers with ultrasonic fill sensors and power-metering clamps across campus buildings. Data streams via MQTT to a campus edge gateway running anomaly detection to alert facilities teams to energy spikes and overflowing bins.',
    creatorName: 'Ananya Sharma',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    creatorGithub: 'ananya-sharma',
    bannerGradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    techStack: ['C++', 'ESP32', 'Python', 'MQTT', 'TimescaleDB', 'Grafana'],
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
      },
      {
        id: 'role-eco-2',
        roleName: 'Data Pipeline Engineer',
        description: 'Build automated ingestion pipelines from MQTT broker into TimescaleDB with data aggregation.',
        skillsNeeded: ['Python', 'MQTT', 'PostgreSQL'],
        status: 'open',
      }
    ],
    sponsorshipTiers: [],
    sponsorsList: [],
    guidanceTopics: [
      {
        id: 'guide-eco-1',
        question: 'Best antenna configuration for penetrating reinforced dormitory concrete walls on 2.4GHz?',
        askedBy: 'Ananya Sharma',
        askedAt: '2026-08-04T09:15:00Z',
        replies: [
          {
            id: 'reply-eco-1',
            repliedBy: 'Prof. Miller',
            replyText: 'Consider switching from pure Wi-Fi to ESP-NOW mesh networking or 868MHz LoRa for inter-floor penetration.',
            repliedAt: '2026-08-04T11:30:00Z',
          }
        ]
      }
    ],
    contributeIssues: [
      {
        id: 'issue-eco-1',
        title: 'Add LoRa fallback driver for remote battery nodes',
        difficulty: 'hard',
        link: 'https://github.com/devsnapz/campus-ecosync/issues/4',
        status: 'open',
      },
      {
        id: 'issue-eco-2',
        title: 'Design battery health indicator widget in dashboard',
        difficulty: 'easy',
        link: 'https://github.com/devsnapz/campus-ecosync/issues/9',
        status: 'open',
      }
    ]
  },
  {
    id: 'medvision-ai',
    title: 'MedVision-AI',
    pitch: 'Open-access federated computer vision tool for student pulmonary X-ray analysis.',
    description: 'MedVision-AI allows bio-engineering and computer science students to train and evaluate chest X-ray segmentation models without centralizing sensitive patient scans. Employs PyTorch, differential privacy, and client-side ONNX runtime inference.',
    creatorName: 'Rohan Verma',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    creatorGithub: 'rohan-verma-ml',
    bannerGradient: 'from-blue-600 via-indigo-600 to-violet-700',
    techStack: ['Python', 'PyTorch', 'ONNX', 'FastAPI', 'React', 'TailwindCSS'],
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
      },
      {
        id: 'role-med-2',
        roleName: 'UI/UX Medical Imaging Specialist',
        description: 'Design DICOM viewer controls, windowing presets, and segmentation mask opacity overlays.',
        skillsNeeded: ['React', 'TypeScript', 'Web Workers'],
        status: 'open',
      }
    ],
    sponsorshipTiers: [],
    sponsorsList: [],
    guidanceTopics: [
      {
        id: 'guide-med-1',
        question: 'How to reliably calculate Dice loss gradient with multi-class lung masks on low VRAM GPUs?',
        askedBy: 'Rohan Verma',
        askedAt: '2026-09-02T16:00:00Z',
        replies: []
      }
    ],
    contributeIssues: []
  },
  {
    id: 'peersync',
    title: 'PeerSync',
    pitch: 'Local-first, encrypted peer-to-peer knowledge graph and study notes for student cohorts.',
    description: 'A distraction-free collaborative markdown canvas built with CRDTs (Yjs) and WebRTC. Notes sync directly between classmates on the same Wi-Fi or across campus without any central cloud database or vendor lock-in.',
    creatorName: 'Sarah Chen',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    creatorGithub: 'sarahchen-dev',
    bannerGradient: 'from-amber-500 via-rose-500 to-red-600',
    techStack: ['Rust', 'WebAssembly', 'TypeScript', 'WebRTC', 'CRDTs', 'TailwindCSS'],
    githubUrl: 'https://github.com/devsnapz/peersync',
    liveUrl: 'https://peersync.devsnapz.org',
    fundingGoal: 1000,
    fundingRaised: 800,
    helpNeeded: {
      sponsor: false,
      collaborate: true,
      guide: false,
      contribute: true,
    },
    openRoles: [
      {
        id: 'role-peer-1',
        roleName: 'Rust / WASM Core Engineer',
        description: 'Compile our vector diff engine to WebAssembly and benchmark peer synchronization throughput.',
        skillsNeeded: ['Rust', 'WebAssembly', 'CRDTs'],
        status: 'open',
      },
      {
        id: 'role-peer-2',
        roleName: 'Technical Documentation Lead',
        description: 'Document the peer-to-peer gossip protocol, end-to-end encryption scheme, and contributor guide.',
        skillsNeeded: ['Markdown', 'API Docs', 'Security'],
        status: 'open',
      }
    ],
    sponsorshipTiers: [],
    sponsorsList: [],
    guidanceTopics: [],
    contributeIssues: [
      {
        id: 'issue-peer-1',
        title: 'Add offline conflict visualizer in sidebar',
        difficulty: 'medium',
        link: 'https://github.com/devsnapz/peersync/issues/14',
        status: 'open',
      }
    ]
  }
];
