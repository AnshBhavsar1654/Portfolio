// Never ranked: no bars, percentages or skill levels. Groups only set the
// order of the logo wall (languages, then frameworks and tools, then AI);
// they are not shown as headings. Names grounded in real work only.
export const skillGroups: { title: string; skills: string[] }[] = [
  {
    title: "Languages",
    skills: ["Python", "JavaScript", "C++", "SQL"],
  },
  {
    title: "Frameworks & tools",
    skills: [
      "Next.js",
      "React",
      "Flask",
      "Streamlit",
      "Leaflet",
      "Recharts",
      "Vercel",
      "PostgreSQL",
      "Redis",
      "NumPy",
      "Pandas",
      "Tableau",
    ],
  },
  {
    title: "AI",
    skills: [
      "AI agents",
      "Prompt optimization",
      "RAG pipelines",
      "SFT/RLHF",
      "LangChain",
      "LangGraph",
      "PyTorch",
      "Scikit-Learn",
      "Transformers",
      "Hugging Face",
      "OpenCV",
    ],
  },
];
