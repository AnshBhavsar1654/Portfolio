import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { publications } from "@/content/research";

export function GET() {
  const lines = [
    `# ${profile.name} | ${profile.role}`,
    ``,
    `> LLM Engineer in ${profile.location}. Builds evaluable prompts, RAG pipelines, and full-stack data apps.`,
    ``,
    `## Contact`,
    `- Email: ${profile.email}`,
    `- GitHub: ${profile.socials.github}`,
    `- LinkedIn: ${profile.socials.linkedin}`,
    ``,
    `## Experience`,
    ...experience.map(
      (e) => `- ${e.role}, ${e.org} (${e.period}): ${e.bullets[0]}`
    ),
    ``,
    `## Projects`,
    ...projects.map(
      (p) =>
        `- ${p.title}: ${p.summary}${p.demo ? ` Demo: ${p.demo}` : ""}${p.github ? ` Code: ${p.github}` : ""}`
    ),
    ``,
    `## Publications`,
    ...publications.map((p) => `- ${p.title} (${p.venue}): ${p.link}`),
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
