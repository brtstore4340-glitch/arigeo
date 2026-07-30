"use client";

import { socialLinks } from "@/data/site-config";

export default function Footer() {
  return (
    <footer className="arigeo-footer">
      <div className="footer-follow">
        <h3 className="footer-follow-title">Follow us</h3>
        <div className="footer-social-color">
          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <img src="/images/social/facebook.png" alt="Facebook" />
          </a>
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <img src="/images/social/instagram.png" alt="Instagram" />
          </a>
          <a
            href={socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <img src="/images/social/youtube.png" alt="YouTube" />
          </a>
          {socialLinks.tiktok && (
            <a
              href={socialLinks.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <img src="/images/social/tiktok.png" alt="TikTok" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
