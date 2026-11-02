import { BrandIcon } from "@/components/site/brand-icon";
import { ContributionGraph } from "@/components/home/contribution-graph";
import { profile } from "@/content/profile";
import {
  leetcodeUser,
  getLeetCodeActivity,
} from "@/lib/leetcode-contributions";

// Server component: same shape as GitHubActivity, fed by the LeetCode
// submission calendar (see lib/leetcode-contributions). On fetch failure it
// renders a plain link to the LeetCode profile.
export async function LeetCodeActivity() {
  const user = leetcodeUser();
  const data = await getLeetCodeActivity();

  if (!data) {
    return (
      <div className="glass border-line rounded-[var(--radius-panel)] border p-8 md:p-10">
        <h3 className="text-strong text-xl font-semibold tracking-tight">
          LeetCode Activity
        </h3>
        <a
          href={profile.socials.leetcode}
          target="_blank"
          rel="noopener noreferrer"
          className="text-body hover:text-accent mt-4 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <BrandIcon
            name="leetcode"
            size={16}
            className="text-brand-leetcode"
          />
          See my activity on LeetCode
        </a>
      </div>
    );
  }

  return (
    <ContributionGraph
      title="LeetCode Activity"
      handle={user}
      href={profile.socials.leetcode}
      unit="submissions"
      dayUnit="submission"
      total={data.total}
      days={data.days}
    />
  );
}
