"use client";

import { useEffect, useState } from "react";
import styles from "./error-alert.module.css";

type Props = {
  title: string;
  message: string;
  onDismiss?: () => void;
  autoDismissSeconds?: number;
};

export default function ErrorAlert({
  title,
  message,
  onDismiss,
  autoDismissSeconds,
}: Props) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismissSeconds && autoDismissSeconds > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, autoDismissSeconds * 1000);
      return () => clearTimeout(timer);
    }
  }, [autoDismissSeconds, onDismiss]);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div className={styles.alert} role="alert" aria-live="assertive">
      <div className={styles.icon}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <circle cx="12" cy="16" r="1" />
        </svg>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
      </div>

      {onDismiss && (
        <button
          className={styles.close}
          onClick={handleDismiss}
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  );
}
