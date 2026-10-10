export type Project = {
  slug: string;
  title: string;
  summary: string;
  image: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
  metrics: { value: string; label: string }[];
  highlights: string[]; // 2 to 3 short points, each ≤ 140 chars (plan §5.3, TODO(ansh) review)
};

export const projects: Project[] = [
  {
    slug: "ahmedabad-metro",
    title: "Ahmedabad Metro",
    summary:
      "Smart transit platform with route finding, nearby stations, fares, maps, and a trilingual chatbot.",
    image: "/img/project-2.jpg",
    tags: ["Flask", "React", "Leaflet", "Botpress"],
    github: "https://github.com/AnshBhavsar1654/Ahmedabad-Metro",
    demo: "https://ahmedabad-metro-frontend.vercel.app/",
    featured: true,
    metrics: [
      { value: "3-lang", label: "chatbot support" },
      { value: "Live", label: "maps + fares" },
    ],
    highlights: [
      "Route finding between stations with fares and a nearby-station lookup on an interactive Leaflet map.",
      "Chatbot built on Botpress answers rider questions in three languages.",
      "Flask backend with a React frontend, deployed live on Vercel.",
    ],
  },
  {
    slug: "cm-outreach-dashboard",
    title: "CM Outreach Dashboard",
    summary:
      "Geospatial analytics of CM outreach across Gujarat with filters, clustering, and trend charts.",
    image: "/img/project-1.jpg",
    tags: ["React", "Leaflet", "Recharts"],
    github: "https://github.com/AnshBhavsar1654",
    demo: "https://cmvisitdashboard.netlify.app/",
    featured: true,
    metrics: [
      { value: "District", label: "deep-linked filters" },
      { value: "Geo", label: "marker clustering" },
    ],
    highlights: [
      "Maps CM outreach events across Gujarat with marker clustering for dense areas.",
      "District-level filters are deep-linkable, so any filtered view can be shared as a URL.",
      "Recharts trend charts sit alongside the map for time-based patterns.",
    ],
  },
  {
    slug: "en-gu-transformer",
    title: "English-Gujarati Transformer",
    summary:
      "Encoder-decoder NMT with multi-head attention, BLEU/CHRF eval, Streamlit app, HF model release.",
    image: "/img/project-3.png",
    tags: ["PyTorch", "Transformers", "Streamlit", "Hugging Face"],
    github: "https://github.com/AnshBhavsar1654/en-gu-transformer",
    demo: "https://en-gu-transformer-upigwgvkjtmccxwe5dtbzt.streamlit.app/",
    featured: true,
    metrics: [
      { value: "BLEU/CHRF", label: "eval reported" },
      { value: "Live", label: "bilingual demo" },
    ],
    highlights: [
      "Encoder-decoder translation model with multi-head attention, built in PyTorch.",
      "Evaluated with BLEU and CHRF rather than eyeballed samples.",
      "Released as a Hugging Face model with a live Streamlit demo.",
    ],
  },
  {
    slug: "hand-cricket-game",
    title: "Hand Cricket Game",
    summary:
      "Classic hand cricket in the browser with live scores, best-score persistence, and mobile-first UI.",
    image: "/img/hand_cricket.png",
    tags: ["JavaScript", "LocalStorage", "Game"],
    github: "https://github.com/AnshBhavsar1654/Hand-Cricket-Game",
    demo: "https://anshbhavsar1654.github.io/Hand-Cricket-Game/",
    featured: true,
    metrics: [{ value: "0-6", label: "run input range" }],
    highlights: [
      "Classic hand cricket in the browser: pick a number from 0 to 6 each ball and the score updates live.",
      "Best score persists between visits via LocalStorage.",
      "Mobile-first layout, built in plain JavaScript with no framework.",
    ],
  },
  {
    slug: "cwc23-tableau",
    title: "Cricket World Cup 2023 Analysis",
    summary:
      "Tableau dashboard for runs, wickets, venues, and umpire patterns from the 2023 tournament.",
    image: "/img/world_cup.jpg",
    tags: ["Tableau", "Analytics"],
    github: "https://github.com/AnshBhavsar1654/CWC23-Analysis-Using-Tableau",
    featured: false,
    metrics: [{ value: "Visual", label: "tournament insights" }],
    highlights: [
      "Tableau dashboard covering runs, wickets and venues from the 2023 tournament.",
      "Includes umpire patterns alongside the player and team statistics.",
      "Built to answer questions interactively rather than as static charts.",
    ],
  },
];
