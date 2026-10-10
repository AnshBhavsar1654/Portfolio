"use client";

import { useState } from "react";
import { profile } from "@/content/profile";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<{ email?: string; message?: string }>(
    {}
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // Honeypot: bots fill it, humans never see it.
    if (data.get("_gotcha")) {
      setStatus("sent");
      return;
    }
    const next: typeof errors = {};
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email address.";
    if (message.length < 10)
      next.message = "Tell me a little more (at least 10 characters).";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/mnndrkol", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      setStatus(res.ok ? "sent" : "error");
      if (res.ok) form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p
        role="status"
        className="border-line bg-surface text-body rounded-xl border p-6 text-sm leading-relaxed md:p-8"
      >
        Message sent. I will reply within two days.
      </p>
    );
  }

  const input =
    "rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-strong placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none";

  return (
    <form
      onSubmit={onSubmit}
      className="border-line bg-surface rounded-xl border p-6 md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="contact-name"
            className="text-strong text-sm font-medium"
          >
            Your name
          </label>
          <input
            id="contact-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Jane Cooper"
            className={input}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="contact-email"
            className="text-strong text-sm font-medium"
          >
            Your email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jane@company.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={input}
          />
          {errors.email ? (
            <p id="contact-email-error" className="text-accent text-xs">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <label
          htmlFor="contact-message"
          className="text-strong text-sm font-medium"
        >
          Project details
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="What are you building, and how will we know it works?"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          className={input}
        />
        {errors.message ? (
          <p id="contact-message-error" className="text-accent text-xs">
            {errors.message}
          </p>
        ) : null}
      </div>
      {/* Honeypot field: hidden from sighted users and screen readers alike. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />
      <p aria-live="polite" className="text-muted mt-4 min-h-5 text-sm">
        {status === "sending"
          ? "Sending…"
          : status === "error"
            ? `Something failed. Email me directly at ${profile.email}.`
            : ""}
      </p>
      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-accent text-on-accent hover:bg-accent-hover mt-2 rounded-full px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
