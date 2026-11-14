import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { cn } from "@/lib/cn";

// Diagonal arrow that leaves through the top-right corner while its twin
// slides in from the bottom-left. Driven by the nearest `group` ancestor,
// so it follows the whole link or card, not just the icon.
export function ArrowSwap({
  size = 16,
  weight = "bold",
  className,
}: {
  size?: number;
  weight?: "regular" | "bold";
  className?: string;
}) {
  const move =
    "absolute inset-0 transition-transform duration-(--dur-slow) ease-(--ease-base)";
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-block shrink-0 overflow-hidden",
        className
      )}
      style={{ width: size, height: size }}
    >
      <ArrowUpRight
        size={size}
        weight={weight}
        className={cn(
          move,
          "group-hover:translate-x-full group-hover:-translate-y-full group-focus-visible:translate-x-full group-focus-visible:-translate-y-full"
        )}
      />
      <ArrowUpRight
        size={size}
        weight={weight}
        className={cn(
          move,
          "-translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0"
        )}
      />
    </span>
  );
}
