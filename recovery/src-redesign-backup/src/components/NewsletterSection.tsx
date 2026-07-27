"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterSection() {
  const t = useTranslations("Newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    // Mock network request
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  }

  return (
    <section className="shell newsletter-wrap">
      <div className="newsletter">
        <div>
          <h2>{t("title")}</h2>
          <p>{t("description")}</p>
        </div>
        {status === "success" ? (
          <div className="bg-white/80 rounded-xl p-6 border border-green-200">
            <p className="text-base font-semibold text-green-800" role="status">
              {t("success")}
            </p>
          </div>
        ) : (
          <form onSubmit={subscribe}>
            <label className="sr-only" htmlFor="email">{t("placeholder")}</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
              placeholder={t("placeholder")}
            />
            <button type="submit" disabled={status === "loading"}>
              {status === "loading" ? t("subscribing") : t("button")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
