"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./purpose-section.module.css";

type PurposeCard = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  link: string;
  linkText: string;
};

const purposeCards: PurposeCard[] = [
  {
    id: "about",
    title: "เกี่ยวกับคาโอ",
    description:
      "เราพัฒนาผลิตภัณฑ์ที่มีคุณภาพสูงและยั่งยืน รวมถึงมอบการบริการที่จะทำให้ผู้คน สังคม และโลกใบนี้มีความเป็นอยู่ที่ดียิ่งขึ้น",
    imageUrl: "/images/home/news-corporate-building.png",
    imageAlt: "About Kao",
    link: "/about",
    linkText: "อ่านเพิ่มเติม",
  },
  {
    id: "sustainability",
    title: "ความยั่งยืน",
    description:
      "การสร้างผลิตภัณฑ์ที่ดีต่อสิ่งแวดล้อมและสังคม เป็นส่วนสำคัญของการดำเนินธุรกิจของเรา",
    imageUrl: "/images/home/news-sustainability-globe.png",
    imageAlt: "Sustainability",
    link: "/sustainability",
    linkText: "อ่านเพิ่มเติม",
  },
  {
    id: "innovation",
    title: "นวัตกรรม",
    description:
      "เราลงทุนในการวิจัยและพัฒนาเพื่อสร้างผลิตภัณฑ์ที่ตอบสนองความต้องการของผู้คน",
    imageUrl: "/images/home/news-lifestyle-couple.png",
    imageAlt: "Innovation",
    link: "/innovation",
    linkText: "อ่านเพิ่มเติม",
  },
  {
    id: "brands",
    title: "แบรนด์ของเรา",
    description:
      "แบรนด์ชั้นนำที่เชื่อถือได้ที่ช่วยให้ชีวิตของผู้คนดีขึ้นทุกวัน",
    imageUrl: "/images/home/hero-products.png",
    imageAlt: "Our Brands",
    link: "/brands",
    linkText: "อ่านเพิ่มเติม",
  },
];

export default function PurposeSection() {
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = entry.target.getAttribute("data-card-id");
            if (cardId) {
              setVisibleCards((prev) => new Set(prev).add(cardId));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(cardRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>สำเร็จการศึกษาและการพัฒนา</h2>

        <div className={styles.gridContainer}>
          {purposeCards.map((card, idx) => (
            <div
              key={card.id}
              ref={(el) => {
                if (el) cardRefs.current[card.id] = el;
              }}
              data-card-id={card.id}
              className={`${styles.card} ${
                visibleCards.has(card.id) ? styles.visible : ""
              }`}
            >
              <div className={styles.imageWrapper}>
                <div className={styles.imagePlaceholder}>
                  <img
                    src={card.imageUrl}
                    alt={card.imageAlt}
                    className={styles.image}
                    loading="lazy"
                  />
                </div>
              </div>

              <div className={styles.content}>
                <div className={styles.textBlock}>
                  <h3 className={styles.title}>{card.title}</h3>
                  <p className={styles.description}>{card.description}</p>
                </div>

                <div className={styles.linkBlock}>
                  <a href={card.link} className={styles.link}>
                    <span className={styles.linkIcon}>→</span>
                    <span className={styles.linkText}>{card.linkText}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
