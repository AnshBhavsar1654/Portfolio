"use client";

import { useEffect, useState } from "react";

// One IntersectionObserver follows scroll and reports the active home section.
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    for (const s of sections) observer.observe(s);
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
