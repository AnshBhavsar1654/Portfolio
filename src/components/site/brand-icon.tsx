import { IconBrandLinkedinFilled } from "@tabler/icons-react";
import {
  siGithub,
  siInstagram,
  siLeetcode,
  siX,
  siYoutube,
} from "simple-icons";

// Real brand glyphs: Simple Icons paths, except LinkedIn (removed upstream
// at the brand's request) which comes from Tabler's filled set. Painted with
// the folio brand tokens via currentColor, so they hold in both themes.
const PATHS = {
  github: siGithub.path,
  leetcode: siLeetcode.path,
  instagram: siInstagram.path,
  x: siX.path,
  youtube: siYoutube.path,
} as const;

export type BrandName = keyof typeof PATHS | "linkedin";

export function BrandIcon({
  name,
  size = 16,
  className,
}: {
  name: BrandName;
  size?: number;
  className?: string;
}) {
  if (name === "linkedin") {
    return (
      <IconBrandLinkedinFilled aria-hidden size={size} className={className} />
    );
  }
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
