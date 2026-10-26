// Grouped, never ranked: no bars, percentages or skill levels. Group order is
// a hierarchy of what leads the work (agents & evaluation first); skills
// inside a group are unordered. Names grounded in real work only.
export const skillGroups: { title: string; skills: string[] }[] = [
  {
    title: "Agents & evaluation",
    skills: [
      "AI agents",
      "Prompt optimization",
      "RAG pipelines",
      "SFT/RLHF",
      "Hugging Face",
    ],
  },
  {
    title: "ML / deep learning",
    skills: [
      "Python",
      "PyTorch",
      "TensorFlow",
      "Scikit-Learn",
      "Transformers",
      "OpenCV",
    ],
  },
  {
    title: "Full-stack",
    skills: [
      "Next.js",
      "Flask",
      "React",
      "Leaflet",
      "JavaScript",
      "Streamlit",
      "Vercel / Netlify",
    ],
  },
  {
    title: "Data & analytics",
    skills: ["SQL", "Redis", "NumPy", "Pandas", "Recharts", "Tableau"],
  },
];
