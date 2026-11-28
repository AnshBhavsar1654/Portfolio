export type Experience = {
  org: string;
  role: string;
  period: string;
  location: string;
  // Org/company LinkedIn URL. Links render only when present.
  url?: string;
  bullets: string[];
  tags: string[];
};

export const experience: Experience[] = [
  {
    org: "Serin AI",
    role: "Founding Engineer",
    period: "Jul 2026 - Present",
    location: "Ahmedabad, India",
    url: "https://linkedin.com/company/serin-labs",
    bullets: [
      "Built and fixed production features in Next.js, TypeScript, and FastAPI.",
      "Proposed running backend instances on demand and scaling to zero when idle, which helped cut infrastructure costs by about 70%.",
      "Added Supabase Edge Functions, PostHog event tracking, and Slack alerts. Extended internal dashboards to track system performance, API latency, and costs.",
    ],
    tags: ["Next.js", "TypeScript", "FastAPI", "Observability"],
  },
  {
    org: "Serin AI",
    role: "LLM Engineering Intern",
    period: "Dec 2025 - Jun 2026",
    location: "Ahmedabad, India",
    url: "https://linkedin.com/company/serin-labs",
    bullets: [
      "Built a framework to test prompts for resume screening, AI interviews, and candidate reports.",
      "Improved measured prompt quality by 35% by revising prompts, tracking versions, and using automated tests to catch regressions in AI interviews.",
      "Prototyped a voice agent that called candidates with reminders based on their interview schedules.",
    ],
    tags: ["LLM Evaluation", "Prompt Engineering", "Voice Agents"],
  },
  {
    org: "Pravi",
    role: "Technical Intern",
    period: "Aug 2025 - Oct 2025",
    location: "Remote",
    url: "https://linkedin.com/company/pravi-research",
    bullets: [
      "Built a daily pipeline that extracted articles from Gujarat Samachar, Sandesh, and Divya Bhaskar and sent structured data to a dashboard.",
      "Updated the dashboard interface, optimized its components, and fixed bugs.",
    ],
    tags: ["Automation", "Data Pipelines", "UI/UX"],
  },
  {
    org: "Intech Creative Services",
    role: "AI/ML Intern",
    period: "May 2025 - Jul 2025",
    location: "Ahmedabad, India",
    url: "https://www.linkedin.com/company/intech-creative-services-pvt-ltd",
    bullets: [
      "Built a system that parsed, matched, and ranked resumes against job descriptions. It reached 95% scoring accuracy across 500+ resumes. Benchmarked open-source models for accuracy, latency, and compute cost.",
      "Connected three n8n workflows to ElevenLabs voice agents and Google Chat APIs using OAuth 2.0 to handle candidate communication and interview scheduling.",
    ],
    tags: ["Resume Matching", "n8n", "ElevenLabs", "OAuth 2.0"],
  },
];

export type Education = {
  school: string;
  degree: string;
  period: string;
  location: string;
  scores: { value: string; label: string }[];
  focus: string[];
  // Optional short paragraph under the degree; renders only when present.
  description?: string;
};

export const education: Education[] = [
  {
    school: "Nirma University",
    degree: "B.Tech in Computer Science, Minor in Adaptive AI",
    period: "Sept 2022 - May 2026",
    location: "Ahmedabad, India",
    scores: [{ value: "9.07", label: "CGPA" }],
    focus: ["Algorithms", "Systems", "ML / DL", "Hackathons", "Applied AI"],
  },
  {
    school: "Hillwoods School",
    degree: "Higher Secondary (PCM)",
    period: "2008 - 2022",
    location: "Gandhinagar, India",
    scores: [
      { value: "97.33%", label: "10th" },
      { value: "97%", label: "12th" },
    ],
    focus: ["Leadership roles", "Extracurriculars", "Inter-school sport"],
  },
];
