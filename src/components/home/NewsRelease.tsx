"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./news-release.module.css";

type NewsItem = {
  id: string;
  date: string;
  category: string;
  title: string;
  image: string;
  link: string;
};

const newsItems: NewsItem[] = [
  {
    id: "1",
    date: "2026-07-25",
    category: "ธุรกิจ",
    title: "ผลิตภัณฑ์ ARIGEO ได้รับการรับรองมาตรฐานสากล",
    image: "/images/home/news-corporate-building.png",
    link: "/news/1",
  },
  {
    id: "2",
    date: "2026-07-20",
    category: "วิจัยและพัฒนา",
    title: "นวัตกรรมใหม่ในการพัฒนาผลิตภัณฑ์ที่ปลอดภัย",
    image: "/images/home/news-product-handwash.png",
    link: "/news/2",
  },
  {
    id: "3",
    date: "2026-07-15",
    category: "ความยั่งยืน",
    title: "ARIGEO มุ่งสู่ความเป็นเลิศด้านความยั่งยืน",
    image: "/images/home/news-sustainability-globe.png",
    link: "/news/3",
  },
  {
    id: "4",
    date: "2026-07-10",
    category: "ชุมชน",
    title: "กิจกรรมสัมพันธ์โครงการดูแลชุมชน",
    image: "/images/home/news-lifestyle-couple.png",
    link: "/news/4",
  },
  {
    id: "5",
    date: "2026-07-05",
    category: "บุคลากร",
    title: "ทีมงาน ARIGEO เข้ารับการอบรมด้านความปลอดภัย",
    image: "/images/home/news-corporate-building.png",
    link: "/news/5",
  },
];

export default function NewsRelease() {
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemId = entry.target.getAttribute("data-news-id");
            if (itemId) {
              setVisibleItems((prev) => new Set(prev).add(itemId));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(itemRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>ข่าวประชาสัมพันธ์</h2>
        </div>

        <div className={styles.newsList}>
          {newsItems.map((item, idx) => (
            <article
              key={item.id}
              ref={(el) => {
                if (el) itemRefs.current[item.id] = el;
              }}
              data-news-id={item.id}
              className={`${styles.newsItem} ${
                visibleItems.has(item.id) ? styles.visible : ""
              }`}
            >
              <Link href={item.link} className={styles.newsLink}>
                <div className={styles.contentArea}>
                  <div className={styles.metaBlock}>
                    <time className={styles.date}>{item.date}</time>
                    <span className={styles.tag}>{item.category}</span>
                  </div>

                  <div className={styles.textBlock}>
                    <h3 className={styles.newsTitle}>{item.title}</h3>
                  </div>

                  <div className={styles.cta}>
                    <span className={styles.ctaText}>อ่านเพิ่มเติม</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className={styles.ctaIcon}
                    >
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className={styles.imageArea}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.newsImage}
                    loading="lazy"
                  />
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className={styles.footer}>
          <Link href="/news" className={styles.allNewsLink}>
            <span>ดูข่าวทั้งหมด</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className={styles.footerIcon}
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
