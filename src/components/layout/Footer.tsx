"use client";

import React from "react";
import Link from "next/link";

const socialItems = [
  {
    key: "linkedin",
    label: "LinkedIn",
    path: "M20.447 20.452h-3.554V14.87c0-1.33-.026-3.04-1.852-3.04-1.853 0-2.136 1.446-2.136 2.94v5.682H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.266 2.37 4.266 5.455zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zM7.119 20.452H3.555V9H7.12zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z",
  },
  {
    key: "instagram",
    label: "Instagram",
    path: "M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2H7.75zm0 1.8h8.5a3.95 3.95 0 0 1 3.95 3.95v8.5a3.95 3.95 0 0 1-3.95 3.95h-8.5a3.95 3.95 0 0 1-3.95-3.95v-8.5A3.95 3.95 0 0 1 7.75 3.8zM17.25 5.25a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 6.5A5.5 5.5 0 1 0 17.5 12 5.5 5.5 0 0 0 12 6.5zm0 1.8A3.7 3.7 0 1 1 8.3 12 3.7 3.7 0 0 1 12 8.3z",
  },
  {
    key: "youtube",
    label: "YouTube",
    path: "M23.498 6.186a2.99 2.99 0 0 0-2.103-2.117C19.541 3.57 12 3.57 12 3.57s-7.541 0-9.395.5A2.99 2.99 0 0 0 .502 6.186C0 8.054 0 12 0 12s0 3.946.502 5.814a2.99 2.99 0 0 0 2.103 2.117c1.854.499 9.395.499 9.395.499s7.541 0 9.395-.499a2.99 2.99 0 0 0 2.103-2.117C24 15.946 24 12 24 12s0-3.946-.502-5.814zM9.6 15.57V8.43L15.84 12 9.6 15.57z",
  },
  {
    key: "facebook",
    label: "Facebook",
    path: "M13.135 22v-8.034h2.714l.406-3.13h-3.12V8.84c0-.907.252-1.525 1.553-1.525h1.659V4.513c-.287-.038-1.272-.123-2.418-.123-2.39 0-4.028 1.46-4.028 4.142v2.304H8.196v3.13h2.705V22z",
  },
];

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Innovation", href: "/innovation" },
  { label: "Our Brands", href: "/brands" },
  { label: "Newsroom", href: "/newsroom" },
  { label: "Careers", href: "/careers" },
  { label: "Products", href: "/products" },
  { label: "Contact Us", href: "/contact" },
];

export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        borderTop: "1px solid rgba(17,17,17,0.12)",
        background: "#fff",
        fontFamily: "var(--font-sans)",
      }}
      role="contentinfo"
    >
      {/* Back to Top Button */}
      <a
        href="#top"
        aria-label="Page Top"
        style={{
          position: "absolute",
          right: "clamp(18px,3vw,34px)",
          bottom: "100%",
          marginBottom: 18,
          width: 46,
          height: 46,
          display: "grid",
          placeItems: "center",
          border: "1px solid rgba(17,17,17,0.14)",
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 10px 24px rgba(17,17,17,0.12)",
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderTop: "2px solid #111",
            borderLeft: "2px solid #111",
            transform: "rotate(45deg) translate(2px,2px)",
          }}
        />
      </a>

      {/* Follow Us Section */}
      <div
        style={{
          display: "flex",
          minHeight: 104,
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          borderBottom: "1px solid rgba(17,17,17,0.12)",
          textAlign: "center",
          flexDirection: "column",
          padding: "20px 0",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "clamp(20px,2vw,28px)",
            fontWeight: 800,
          }}
        >
          Follow us
        </h2>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {socialItems.map((item) => (
            <button
              key={item.key}
              type="button"
              title="Awaiting Official URL"
              aria-label={`${item.label} — Awaiting official URL`}
              style={{
                width: 46,
                height: 46,
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                background: "#fff",
                color: "#111",
                border: "1px solid rgba(17,17,17,0.16)",
                cursor: "help",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d={item.path} fill="currentColor" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Navigation */}
      <nav
        aria-label="Footer navigation"
        style={{
          display: "flex",
          minHeight: 78,
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          borderBottom: "1px solid rgba(17,17,17,0.12)",
        }}
      >
        {primaryLinks.map((link, i) => (
          <Link
            key={link.label}
            href={link.href}
            style={{
              display: "flex",
              minHeight: 44,
              alignItems: "center",
              padding: "0 18px",
              borderLeft:
                i === 0 ? "1px solid rgba(17,17,17,0.12)" : "none",
              borderRight: "1px solid rgba(17,17,17,0.12)",
              color: "#333",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Logo and Description */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto minmax(0,460px)",
          gap: 28,
          alignItems: "center",
          justifyContent: "center",
          padding: "34px 0",
        }}
      >
        <Link href="/" aria-label="ARIGEO home" style={{ display: "inline-flex", alignItems: "center" }}>
          <img
            src="/images/logo.png"
            alt="ARIGEO logo"
            style={{ height: 38, width: "auto", objectFit: "contain" }}
          />
        </Link>
        <p
          style={{
            margin: 0,
            color: "#666",
            fontSize: 13,
            lineHeight: 1.8,
          }}
        >
          Trusted household and skincare products that combine advanced
          innovation with safety and care.
        </p>
      </div>

      {/* Copyright Section */}
      <div
        style={{
          borderTop: "1px solid rgba(17,17,17,0.1)",
          background: "#f7f7f7",
          padding: "18px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            width: "min(1440px, calc(100% - 48px))",
            minHeight: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
            Copyright © Arigeo Co., Ltd. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <a href="#" style={{ fontSize: 12, color: "#555", textDecoration: "none" }}>
              Terms of Use
            </a>
            <a href="#" style={{ fontSize: 12, color: "#555", textDecoration: "none" }}>
              Privacy Policy
            </a>
            <a href="#" style={{ fontSize: 12, color: "#555", textDecoration: "none" }}>
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
