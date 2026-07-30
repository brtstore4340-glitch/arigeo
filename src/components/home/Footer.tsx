"use client";

import { socialLinks, siteInfo } from "@/data/site-config";

export default function Footer() {
  return (
    <footer className="arigeo-footer">
      <div className="arigeo-footer-inner">
        {/* Color Logo */}
        <div className="footer-logo">
          <a href="/">
            <img src={siteInfo.logo} alt={siteInfo.name} />
          </a>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <img src="/images/social/facebook-color.png" alt="Facebook" />
          </a>

          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <img src="/images/social/instagram-color.png" alt="Instagram" />
          </a>

          <a
            href={socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <img src="/images/social/youtube-color.png" alt="YouTube" />
          </a>

          <a
            href={socialLinks.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <img src="/images/social/tiktok-color.png" alt="TikTok" />
          </a>
        </div>
      </div>
    </footer>
  );
}
