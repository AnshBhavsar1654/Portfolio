import { BrandIcon } from "@/components/site/brand-icon";
import { ContributionGraph } from "@/components/home/contribution-graph";
import { profile } from "@/content/profile";
import { getContributions, githubUser } from "@/lib/github-contributions";

// Server component: fetches and caches on the server (see
// lib/github-contributions). Any fetch failure renders a plain link to the
// GitHub profile instead.
export async function GitHubActivity() {
  const user = githubUser();
  const data = await getContributions();

  if (!data) {
    return (
      <div className="glass border-line rounded-[var(--radius-panel)] border p-8 md:p-10">
        <h3 className="text-strong text-xl font-semibold tracking-tight">
          GitHub Activity
        </h3>
        <a
          href={profile.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-body hover:text-accent mt-4 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <BrandIcon name="github" size={16} className="text-brand-github" />
          See my activity on GitHub
        </a>
      </div>
    );
  }

  return (
    <ContributionGraph
      title="GitHub Activity"
      handle={user}
      href={profile.socials.github}
      unit="contributions"
      dayUnit="contribution"
      total={data.total}
      days={data.days}
    />
  );
}
