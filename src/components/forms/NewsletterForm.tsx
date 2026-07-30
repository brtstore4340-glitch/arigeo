"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import styles from "./newsletter-form.module.css";

type Props = {
  onSubmit?: (email: string) => Promise<void>;
};

export default function NewsletterForm({ onSubmit }: Props) {
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      setMessage(locale === "th" ? "กรุณาใส่อีเมลที่ถูกต้อง" : "Please enter a valid email");
      return;
    }

    setStatus("loading");

    try {
      if (onSubmit) {
        await onSubmit(email);
      }
      setStatus("success");
      setMessage(locale === "th" ? "ขอบคุณที่สมัครสมาชิก!" : "Thank you for subscribing!");
      setEmail("");

      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
    } catch (error) {
      setStatus("error");
      setMessage(
        locale === "th"
          ? "เกิดข้อผิดพลาด กรุณาลองใหม่"
          : "An error occurred. Please try again."
      );
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      aria-label={locale === "th" ? "ฟอร์มจดทะเบียนจดหมายข่าว" : "Newsletter signup form"}
    >
      <div className={styles.inputGroup}>
        <input
          type="email"
          className={styles.input}
          placeholder={locale === "th" ? "กรุณาใส่อีเมลของคุณ" : "Enter your email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          required
          aria-label={locale === "th" ? "ที่อยู่อีเมล" : "Email address"}
        />

        <button
          type="submit"
          className={styles.button}
          disabled={status === "loading"}
          aria-busy={status === "loading"}
        >
          {status === "loading" ? (
            <>
              <span className={styles.spinner} aria-hidden="true"></span>
              {locale === "th" ? "กำลังส่ง..." : "Sending..."}
            </>
          ) : locale === "th" ? (
            "สมัครสมาชิก"
          ) : (
            "Subscribe"
          )}
        </button>
      </div>

      {message && (
        <div
          className={`${styles.message} ${styles[status]}`}
          role="alert"
          aria-live="polite"
        >
          {message}
        </div>
      )}

      <p className={styles.disclaimer}>
        {locale === "th"
          ? "เราจะไม่ส่งจดหมายขยะ เฉพาะข้อมูลที่มีคุณค่าเท่านั้น"
          : "No spam. Only valuable updates."}
      </p>
    </form>
  );
}
