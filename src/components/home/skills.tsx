import type { ComponentType } from "react";
import { BrainIcon } from "@phosphor-icons/react/dist/ssr/Brain";
import { ChartBarIcon } from "@phosphor-icons/react/dist/ssr/ChartBar";
import { ChartLineIcon } from "@phosphor-icons/react/dist/ssr/ChartLine";
import { DatabaseIcon } from "@phosphor-icons/react/dist/ssr/Database";
import { FlowArrowIcon } from "@phosphor-icons/react/dist/ssr/FlowArrow";
import { MagicWandIcon } from "@phosphor-icons/react/dist/ssr/MagicWand";
import { RobotIcon } from "@phosphor-icons/react/dist/ssr/Robot";
import { ShapesIcon } from "@phosphor-icons/react/dist/ssr/Shapes";
import {
  siCplusplus,
  siFlask,
  siHuggingface,
  siJavascript,
  siLangchain,
  siLanggraph,
  siLeaflet,
  siNextdotjs,
  siNumpy,
  siOpencv,
  siPandas,
  siPostgresql,
  siPytorch,
  siPython,
  siReact,
  siRedis,
  siScikitlearn,
  siStreamlit,
  siVercel,
} from "simple-icons";
import { skillGroups } from "@/content/skills";
import { cn } from "@/lib/cn";

// Logo wall: one flat grid of square tiles, no group headings. Each tile is
// the real brand mark in its official colour (a neutral Phosphor glyph for
// concepts simple-icons doesn't cover) over its name in mono. The order
// follows skillGroups so what leads the work comes first, but nothing is
// labelled or ranked. Official colours live as --brand-* token pairs in
// folio/colors.css.

type Brand = { path: string; cls: string };
type Glyph = ComponentType<{ className?: string }>;

// Brand marks with their official-colour tokens. "Transformers" shares the
// Hugging Face mark because the library is part of the HF ecosystem.
const BRAND: Record<string, Brand> = {
  "Next.js": { path: siNextdotjs.path, cls: "text-brand-nextdotjs" },
  Flask: { path: siFlask.path, cls: "text-brand-flask" },
  React: { path: siReact.path, cls: "text-brand-react" },
  Leaflet: { path: siLeaflet.path, cls: "text-brand-leaflet" },
  JavaScript: { path: siJavascript.path, cls: "text-brand-javascript" },
  Streamlit: { path: siStreamlit.path, cls: "text-brand-streamlit" },
  Vercel: { path: siVercel.path, cls: "text-brand-vercel" },
  Python: { path: siPython.path, cls: "text-brand-python" },
  PyTorch: { path: siPytorch.path, cls: "text-brand-pytorch" },
  "Scikit-Learn": { path: siScikitlearn.path, cls: "text-brand-scikitlearn" },
  Transformers: { path: siHuggingface.path, cls: "text-brand-huggingface" },
  OpenCV: { path: siOpencv.path, cls: "text-brand-opencv" },
  Redis: { path: siRedis.path, cls: "text-brand-redis" },
  NumPy: { path: siNumpy.path, cls: "text-brand-numpy" },
  "C++": { path: siCplusplus.path, cls: "text-brand-cplusplus" },
  PostgreSQL: { path: siPostgresql.path, cls: "text-brand-postgresql" },
  LangChain: { path: siLangchain.path, cls: "text-brand-langchain" },
  LangGraph: { path: siLanggraph.path, cls: "text-brand-langgraph" },
  Pandas: { path: siPandas.path, cls: "text-brand-pandas" },
  "Hugging Face": { path: siHuggingface.path, cls: "text-brand-huggingface" },
};

const GLYPH: Record<string, Glyph> = {
  "AI agents": RobotIcon,
  "Prompt optimization": MagicWandIcon,
  "RAG pipelines": FlowArrowIcon,
  "SFT/RLHF": BrainIcon,
  SQL: DatabaseIcon,
  Recharts: ChartLineIcon,
  Tableau: ChartBarIcon,
};

function SkillMark({ name }: { name: string }) {
  const brand = BRAND[name];
  if (brand) {
    return (
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className={cn("size-7 shrink-0 fill-current", brand.cls)}
      >
        <path d={brand.path} />
      </svg>
    );
  }
  const Glyph = GLYPH[name] ?? ShapesIcon;
  return (
    <Glyph className="text-muted group-hover/tile:text-accent size-7 shrink-0 transition-colors duration-(--dur-base)" />
  );
}

export function Skills() {
  const all = skillGroups.flatMap((g) => g.skills);
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(6.25rem,1fr))] gap-3">
      {all.map((s) => (
        <li key={s}>
          <div className="group/tile panel-soft text-muted hover:text-strong hover:bg-accent-wash flex h-full min-h-24 flex-col items-center justify-center gap-3 rounded-2xl px-2 py-4 text-center transition-[transform,background-color,color] duration-(--dur-base) ease-(--ease-out-soft) active:scale-[0.97] [@media(hover:hover)]:hover:-translate-y-0.5">
            <SkillMark name={s} />
            <span className="font-mono text-[11px] leading-tight">{s}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
