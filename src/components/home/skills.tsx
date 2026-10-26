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
  siFlask,
  siHuggingface,
  siJavascript,
  siLeaflet,
  siNextdotjs,
  siNumpy,
  siOpencv,
  siPandas,
  siPytorch,
  siPython,
  siReact,
  siRedis,
  siScikitlearn,
  siStreamlit,
  siTensorflow,
  siVercel,
} from "simple-icons";
import { skillGroups } from "@/content/skills";
import { cn } from "@/lib/cn";

// Tool index on frosted glass: one panel per group. Every skill carries a
// mark — the real brand logo in its official colour where one exists, a
// neutral Phosphor glyph for concepts simple-icons doesn't cover (AI agents,
// RAG, RLHF, SQL) or brands it dropped (Tableau, Recharts). Official colours
// live as --brand-* token pairs in folio/colors.css: the exact mark colour in
// light, theme-adjusted in dark so logos never sink into the page. Marks sit
// in small bordered tiles; tiles still carry no proficiency ranking — no
// bars, no percentages.

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
  TensorFlow: { path: siTensorflow.path, cls: "text-brand-tensorflow" },
  "Scikit-Learn": { path: siScikitlearn.path, cls: "text-brand-scikitlearn" },
  Transformers: { path: siHuggingface.path, cls: "text-brand-huggingface" },
  OpenCV: { path: siOpencv.path, cls: "text-brand-opencv" },
  Redis: { path: siRedis.path, cls: "text-brand-redis" },
  NumPy: { path: siNumpy.path, cls: "text-brand-numpy" },
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

// Brand logos keep their official colour (tile hover leaves them be);
// glyphs stay currentColor and warm to accent on tile hover. Anything
// unmapped gets a neutral shapes glyph rather than no mark.
function SkillMark({ name }: { name: string }) {
  const brand = BRAND[name];
  if (brand) {
    return (
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className={cn("size-4 shrink-0 fill-current", brand.cls)}
      >
        <path d={brand.path} />
      </svg>
    );
  }
  const Glyph = GLYPH[name] ?? ShapesIcon;
  return (
    <Glyph className="text-muted group-hover/row:text-accent size-4 shrink-0 transition-colors duration-(--dur-base)" />
  );
}

export function Skills() {
  return (
    <ul className="grid gap-4">
      {skillGroups.map((g, i) => (
        <li
          key={g.title}
          className="group glass border-line hover:border-accent/50 relative rounded-[var(--radius-panel)] border p-6 transition-[transform,border-color] duration-(--dur-base) ease-(--ease-out-soft) hover:-translate-y-0.5 active:scale-[0.99] md:p-8"
        >
          <div className="grid gap-x-12 gap-y-6 md:grid-cols-[minmax(0,15rem)_1fr] lg:grid-cols-[minmax(0,17rem)_1fr]">
            <div className="flex items-baseline gap-4 md:gap-6">
              <span
                aria-hidden
                className="accent-serif text-muted group-hover:text-accent text-3xl leading-none transition-colors duration-(--dur-base)"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-strong text-lg font-semibold tracking-tight md:text-xl">
                {g.title}
              </h3>
            </div>
            <ul className="flex flex-wrap content-start gap-2">
              {g.skills.map((s) => (
                <li
                  key={s}
                  className="group/row border-line text-body hover:border-accent/40 hover:text-strong inline-flex items-center gap-2.5 rounded-[var(--radius-card)] border px-3 py-2 text-[13px] transition-colors duration-(--dur-base)"
                >
                  <SkillMark name={s} />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}
