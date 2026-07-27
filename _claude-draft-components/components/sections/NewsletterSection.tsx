"use client";

import { useState } from "react";
import { Button } from "../ui/Button";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function subscribe() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-[var(--color-surface-alt)]">
      <div className="mx-auto flex max-w-[var(--container-max)] flex-col items-start justify-between gap-8 px-[var(--container-pad)] py-[var(--space-16)] md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-[length:var(--text-h2)] font-bold text-[var(--color-ink)]">
            Stay updated with ARIGEO
          </h2>
          <p className="max-w-[48ch] text-[var(--text-body)] text-[var(--color-ink-soft)]">
            Get the latest on innovation, products and everyday living.
          </p>
        </div>

        {status === "success" ? (
          <p className="text-[var(--text-body)] font-semibold text-[var(--color-ink)]" role="status">
            Subscribed — check your inbox to confirm.
          </p>
        ) : (
          <div className="flex w-full max-w-md flex-col gap-2">
            <div className="flex gap-2 max-sm:flex-col">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                onKeyDown={(e) => e.key === "Enter" && subscribe()}
                placeholder="Your email address"
                aria-label="Email address"
                aria-invalid={status === "error"}
                className="flex-1 rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-[var(--text-body)]
                           placeholder:text-[var(--color-ink-muted)]
                           focus:border-[var(--color-brand-red)] focus:outline-none"
              />
              <Button onClick={subscribe} className={status === "loading" ? "pointer-events-none opacity-60" : ""}>
                {status === "loading" ? "Subscribing…" : "Subscribe"}
              </Button>
            </div>
            {status === "error" && (
              <p className="px-2 text-[var(--text-small)] text-[var(--color-brand-red)]" role="alert">
                Enter a valid email address and try again.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
