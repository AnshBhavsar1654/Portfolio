"use client";

import { useState } from "react";
import { profile } from "@/content/profile";

// Large email CTA with copy button; aria-live announces "Copied".
export function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions, non-secure context): the
      // mailto link below remains the working path.
    }
  };

  return (
    <div>
      <a
        href={`mailto:${profile.email}`}
        // XL is small enough for the full email to sit on one line on every
        // phone; break-all stays as the safety valve for anything narrower.
        className="text-strong hover:text-accent text-xl font-semibold tracking-tight break-all md:text-4xl"
      >
        {profile.email}
      </a>
      <p className="mt-4 flex items-center gap-3">
        <a
          href={profile.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="border-line text-muted hover:text-strong rounded-full border px-4 py-2 font-mono text-xs transition-colors"
        >
          View resume
        </a>
        <button
          suppressHydrationWarning
          type="button"
          onClick={copy}
          className="border-line text-muted hover:text-strong rounded-full border px-4 py-2 font-mono text-xs transition-colors"
        >
          {copied ? "Copied" : "Copy email"}
        </button>
        <span aria-live="polite" className="text-muted text-sm">
          {copied ? "Copied to clipboard." : ""}
        </span>
      </p>
    </div>
  );
}
