import { education, experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

export function GET() {
  const lines = [
    `# ${profile.name} | ${profile.role}`,
    ``,
    `> Founding Engineer in ${profile.location}. Builds full-stack apps, AI agents, and evaluable LLM systems.`,
    ``,
    `## Contact`,
    `- Email: ${profile.email}`,
    `- GitHub: ${profile.socials.github}`,
    `- LeetCode: ${profile.socials.leetcode}`,
    `- LinkedIn: ${profile.socials.linkedin}`,
    `- X: ${profile.socials.x}`,
    ``,
    `## Experience`,
    ...experience.map(
      (e) => `- ${e.role}, ${e.org} (${e.period}): ${e.bullets[0]}`
    ),
    ``,
    `## Education`,
    ...education.map((s) => `- ${s.degree}, ${s.school} (${s.period})`),
    ``,
    `## Projects`,
    ...projects.map(
      (p) =>
        `- ${p.title}: ${p.summary}${p.demo ? ` Demo: ${p.demo}` : ""}${p.github ? ` Code: ${p.github}` : ""}`
    ),
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
