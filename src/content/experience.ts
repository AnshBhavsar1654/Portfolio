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
      "Contributed to production development across Next.js, TypeScript, and FastAPI, delivering frontend enhancements, backend features, and bug fixes to improve platform functionality and reliability.",
      "Helped reduce backend infrastructure costs by approximately 70% by proposing an on-demand, scale-to-zero deployment strategy in place of continuously running cloud instances.",
      "Enhanced product observability through Supabase Edge Functions, PostHog event tracking, and automated Slack alerts, then extended internal dashboards for monitoring system performance, API latency, and costs.",
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
      "Developed an evaluation framework to quantitatively assess prompts across resume screening, AI interviews, and candidate report generation workflows.",
      "Improved prompt quality by 35% through systematic prompt optimization, version tracking, and automated evaluation metrics that measure response quality and identify regressions across AI interview workflows.",
      "Prototyped an outbound voice agent to automate candidate interview reminders, integrating conversational AI with scheduled interview information and calling workflows.",
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
      "Automated daily news aggregation with an end-to-end extraction pipeline for Gujarat Samachar, Sandesh, and Divya Bhaskar, exporting structured data to a dashboard.",
      "Improved dashboard usability and performance through UI/UX enhancements, component optimization, and bug fixes.",
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
      "Achieved 95% accuracy in resume scoring across 500+ resumes by developing a candidate evaluation system for resume parsing, job-description matching, and ranking, then benchmarking open-source models for accuracy, latency, and computational cost.",
      "Streamlined candidate communication and interview scheduling by integrating three n8n workflows with ElevenLabs voice agents, Google Chat APIs, and OAuth 2.0 authentication.",
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
