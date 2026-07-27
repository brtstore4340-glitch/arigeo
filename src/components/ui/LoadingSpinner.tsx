"use client";

import styles from "./loading-spinner.module.css";

type Props = {
  size?: "sm" | "md" | "lg";
  label?: string;
};

export default function LoadingSpinner({ size = "md", label }: Props) {
  return (
    <div className={`${styles.spinner} ${styles[size]}`} role="status" aria-live="polite">
      <div className={styles.ring}></div>
      <div className={styles.ring}></div>
      <div className={styles.ring}></div>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
