"use client";

import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr/ArrowSquareOut";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr/DownloadSimple";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { EASE_BASE } from "@/components/site/motion-tokens";
import { ResumeViewer } from "@/components/site/resume-viewer";
import { profile } from "@/content/profile";

type ResumeApi = { open: (trigger: HTMLElement | null) => void };

const ResumeContext = createContext<ResumeApi | null>(null);

const HISTORY_FLAG = "resumeDialog";

function isDialogEntry() {
  const state = window.history.state as Record<string, unknown> | null;
  return state?.[HISTORY_FLAG] === true;
}

// One dialog instance for the whole site: the nav, hero, footer and contact
// card all open the same window instead of a new tab.
export function ResumeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const popping = useRef(false);

  // Opening pushes a history entry so the browser/phone Back button closes
  // the window instead of leaving the site. Next.js patches pushState and
  // keeps its own router state alongside this flag.
  const open = useCallback((trigger: HTMLElement | null) => {
    returnFocusRef.current = trigger;
    popping.current = false;
    setIsOpen(true);
    if (!isDialogEntry()) {
      window.history.pushState({ [HISTORY_FLAG]: true }, "");
    }
  }, []);

  // Close first, then tidy history. Closing must never wait on popstate:
  // mobile browsers can delay or swallow it, which made the first tap look
  // dead. The ref stops a second back() if the button is tapped again
  // before the first one settles.
  const close = useCallback(() => {
    setIsOpen(false);
    if (isDialogEntry() && !popping.current) {
      popping.current = true;
      window.history.back();
    }
  }, []);

  useEffect(() => {
    const onPop = () => {
      popping.current = false;
      if (!isDialogEntry()) setIsOpen(false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const api = useMemo(() => ({ open }), [open]);

  return (
    <ResumeContext.Provider value={api}>
      {children}
      <ResumeDialog
        open={isOpen}
        onClose={close}
        returnFocusRef={returnFocusRef}
      />
    </ResumeContext.Provider>
  );
}

type ResumeTriggerProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "onClick"
> & {
  onClick?: () => void;
};

// Renders a real link to the PDF, so no-JS and modifier/middle clicks still
// open the document; a plain click opens the in-page window instead.
export function ResumeTrigger({
  onClick,
  children,
  ...rest
}: ResumeTriggerProps) {
  const api = useContext(ResumeContext);

  return (
    <a
      {...rest}
      href={profile.resume}
      aria-haspopup="dialog"
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        if (!api) return;
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        onClick?.();
        api.open(event.currentTarget);
      }}
    >
      {children}
    </a>
  );
}

function ResumeDialog({
  open,
  onClose,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const wasOpen = useRef(false);

  // Scroll lock, initial focus, focus trap, Esc, and returning focus to
  // whichever pill opened the window.
  useEffect(() => {
    if (!open) {
      if (!wasOpen.current) return;
      wasOpen.current = false;
      const trigger = returnFocusRef.current;
      if (trigger?.isConnected) {
        trigger.focus({ preventScroll: true });
        return;
      }
      // Opened from the mobile sheet: that trigger is gone, so land back on
      // the menu button that revealed it.
      document
        .querySelector<HTMLElement>('[aria-controls="mobile-menu"]')
        ?.focus({ preventScroll: true });
      return;
    }

    wasOpen.current = true;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    const frame = requestAnimationFrame(() =>
      closeRef.current?.focus({ preventScroll: true })
    );

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, [open, onClose, returnFocusRef]);

  const duration = reduce ? 0 : 0.32;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="resume"
          className="bg-bg/80 fixed inset-0 z-50 flex items-stretch justify-center backdrop-blur-sm md:items-center md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.24, ease: EASE_BASE }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-dialog-title"
            aria-describedby="resume-dialog-hint"
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration, ease: EASE_BASE }}
            className="bg-surface border-line flex h-full w-full flex-col overflow-hidden border pt-[env(safe-area-inset-top)] shadow-[var(--shadow-lift)] md:h-[min(86dvh,52rem)] md:w-[min(56rem,92vw)] md:pt-0"
          >
            <header className="border-line flex items-center gap-3 border-b px-3 py-2.5 md:px-4">
              <div className="min-w-0 pl-1">
                <p
                  id="resume-dialog-title"
                  className="text-strong truncate text-sm font-semibold tracking-tight"
                >
                  {profile.name} — Resume
                </p>
              </div>
              <div className="ml-auto flex shrink-0 items-center gap-2">
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open resume in a new tab"
                  className="border-line text-muted hover:text-strong hover:border-strong/40 inline-flex h-11 items-center gap-2 border px-3.5 font-mono text-xs transition-colors"
                >
                  <ArrowSquareOut aria-hidden size={16} />
                  <span className="hidden sm:inline">New tab</span>
                </a>
                <a
                  href={profile.resume}
                  download
                  aria-label="Download resume"
                  className="border-line text-muted hover:text-strong hover:border-strong/40 inline-flex h-11 items-center gap-2 border px-3.5 font-mono text-xs transition-colors"
                >
                  <DownloadSimple aria-hidden size={16} />
                  <span className="hidden sm:inline">Download</span>
                </a>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close resume"
                  className="border-line text-strong hover:bg-surface-2 flex size-11 items-center justify-center border transition-colors active:scale-95"
                >
                  <X aria-hidden size={18} />
                </button>
              </div>
            </header>
            <p id="resume-dialog-hint" className="sr-only">
              Press Escape to close this window.
            </p>
            <div className="min-h-0 flex-1">
              <ResumeViewer />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
