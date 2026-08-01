"use client";

import React from "react";
import Link from "next/link";

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

const socialLinks = [
  { label: "LinkedIn", icon: "/images/social/linkedin.svg" },
  { label: "Instagram", icon: "/images/social/instagram.svg" },
  { label: "YouTube", icon: "/images/social/youtube.svg" },
  { label: "Facebook", icon: "/images/social/facebook.svg" },
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

      {/* Follow Us */}
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
          {socialLinks.map((social) => (
            <button
              key={social.label}
              type="button"
              title="Awaiting Official URL"
              aria-label={`${social.label} — Awaiting official URL`}
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
                padding: 0,
              }}
            >
              <img
                src={social.icon}
                alt=""
                aria-hidden="true"
                style={{
                  width: 20,
                  height: 20,
                  objectFit: "contain",
                  display: "block",
                }}
              />
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
          display: "flex",
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
