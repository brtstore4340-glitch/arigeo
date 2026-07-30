"use client";

import { useState, useRef } from "react";
import { useLocale } from "next-intl";
import styles from "./search-bar.module.css";

type Props = {
  onSearch?: (query: string) => void;
  placeholder?: string;
};

export default function SearchBar({ onSearch, placeholder }: Props) {
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultPlaceholder =
    locale === "th"
      ? "ค้นหาผลิตภัณฑ์หรือข้อมูล..."
      : "Search products or information...";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <form
      className={`${styles.searchBar} ${isFocused ? styles.focused : ""}`}
      onSubmit={handleSubmit}
      role="search"
    >
      <label htmlFor="search-input" className={styles.label}>
        {locale === "th" ? "ค้นหา" : "Search"}
      </label>

      <div className={styles.inputWrapper}>
        <svg
          className={styles.searchIcon}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>

        <input
          ref={inputRef}
          id="search-input"
          type="text"
          className={styles.input}
          placeholder={placeholder || defaultPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label={locale === "th" ? "ค้นหา" : "Search"}
        />

        {query && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label={locale === "th" ? "ล้างการค้นหา" : "Clear search"}
          >
            ✕
          </button>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        aria-label={locale === "th" ? "ค้นหา" : "Search"}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </button>
    </form>
  );
}
