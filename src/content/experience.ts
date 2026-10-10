export type Experience = {
  org: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  tags: string[];
};

export const experience: Experience[] = [
  {
    org: "Serin AI",
    role: "Founding Engineer",
    period: "Dec 2025 - Present",
    location: "Ahmedabad, India",
    bullets: [
      "Founding engineer at Serin AI (formerly Blink Analytics): own features end to end, from full-stack product work to AI agents, prompts and evals.",
      "Optimized prompts for question generation, resume screening, and evaluation with SFT/RLHF techniques.",
      "Built automated eval frameworks to benchmark interview quality and speed up prompt iteration.",
      "Shipped voice-agent workflows for reminders and feedback collection.",
    ],
    tags: ["Full-Stack", "LLM Eval", "SFT/RLHF", "Voice Agents"],
  },
  {
    org: "Pravi",
    role: "Technical Intern (Part-time)",
    period: "Aug 2025 - Oct 2025",
    location: "Ahmedabad, India",
    bullets: [
      "Improved consulting site, dashboard backend, and database performance.",
      "Built Gujarati e-paper news ingestion automation.",
    ],
    tags: ["Web", "Backend", "Automation"],
  },
  {
    org: "Intech Creative Services",
    role: "AI/ML Intern",
    period: "May 2025 - Jul 2025",
    location: "Ahmedabad, India",
    bullets: [
      "Ranked 500+ resumes against job descriptions at 95% semantic accuracy.",
      "Cut recruitment coordination 60% with ElevenLabs + n8n outreach automation.",
      "Built Flask + OAuth 2.0 + PostgreSQL backend for chat-space bots.",
    ],
    tags: ["Matching", "Automation", "Flask"],
  },
  {
    org: "Intech Creative Services",
    role: "Machine Learning Intern",
    period: "Jun 2024 - Jul 2024",
    location: "Gandhinagar, India",
    bullets: [
      "Built delivery-timing predictors with EDA and feature engineering.",
      "Added LIME/SHAP interpretability for transparent decisions.",
    ],
    tags: ["ML", "XAI"],
  },
];

export const education = [
  {
    school: "Institute of Technology, Nirma University",
    degree: "B.Tech Computer Science with Minor in Adaptive AI",
    period: "Sept 2022 - May 2026",
    location: "Ahmedabad, India",
    detail:
      "CGPA 9.07. Algorithms, systems, ML/DL. Active in hackathons and applied AI.",
  },
  {
    school: "Hillwoods School",
    degree: "Higher Secondary (PCM)",
    period: "2008 - 2022",
    location: "Gandhinagar, India",
    detail:
      "97.33% (10th), 97% (12th). Leadership roles, extracurriculars, inter-school sport.",
  },
];
