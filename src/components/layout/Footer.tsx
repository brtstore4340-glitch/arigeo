"use client";

import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      {/* Newsletter Section */}
      <section className={styles.newsletter} aria-labelledby="newsletter-heading">
        <div className={styles.container}>
          <div className={styles.newsletterContent}>
            <div>
              <h2 id="newsletter-heading" className={styles.newsletterTitle}>
                Stay updated with ARIGEO
              </h2>
              <p className={styles.newsletterSubtitle}>
                Get the latest on innovation, products and everyday living
              </p>
            </div>
            <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className={styles.newsletterInput}
                aria-label="Email address"
                required
              />
              <button type="submit" className={styles.subscribeButton}>
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Footer Content */}
      <section className={styles.mainFooter}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Column 1: Company */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Our Company</h3>
              <ul className={styles.linkList}>
                <li>
                  <Link href="/about" className={styles.link}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className={styles.link}>
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/newsroom" className={styles.link}>
                    Newsroom
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className={styles.link}>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Brands */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Our Brands</h3>
              <ul className={styles.linkList}>
                <li>
                  <Link href="/brands" className={styles.link}>
                    Captain-Maid
                  </Link>
                </li>
                <li>
                  <Link href="/brands" className={styles.link}>
                    Genuleaf
                  </Link>
                </li>
                <li>
                  <Link href="/brands" className={styles.link}>
                    Ceratory
                  </Link>
                </li>
                <li>
                  <Link href="/products" className={styles.link}>
                    All Products
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Resources</h3>
              <ul className={styles.linkList}>
                <li>
                  <Link href="/innovation" className={styles.link}>
                    Innovation
                  </Link>
                </li>
                <li>
                  <Link href="/sustainability" className={styles.link}>
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.link}>
                    Sustainability Report
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.link}>
                    R&D
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Legal</h3>
              <ul className={styles.linkList}>
                <li>
                  <Link href="#" className={styles.link}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.link}>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.link}>
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.link}>
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: Connect */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Connect</h3>
              <div className={styles.socialLinks}>
                <a
                  href="https://facebook.com/arigeo"
                  className={styles.socialLink}
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  f
                </a>
                <a
                  href="https://instagram.com/arigeo"
                  className={styles.socialLink}
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📷
                </a>
                <a
                  href="https://twitter.com/arigeo"
                  className={styles.socialLink}
                  aria-label="Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  𝕏
                </a>
                <a
                  href="https://youtube.com/arigeo"
                  className={styles.socialLink}
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ▶️
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className={styles.bottom}>
        <div className={styles.container}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              © {currentYear} ARIGEO Co., Ltd. All rights reserved. Trusted household and skincare
              products.
            </p>
            <div className={styles.localeSwitch}>
              <span className={styles.localeLabel}>Language:</span>
              <button className={styles.localeLink} aria-current="true">
                English
              </button>
              <span className={styles.localeDivider}>|</span>
              <button className={styles.localeLink}>ไทย</button>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
