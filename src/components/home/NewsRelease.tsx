"use client";

import s from "./news-release.module.css";

interface NewsItem {
  id: number;
  href: string;
  datetime: string;
  date: string;
  group: string;
  category: string;
  title: string;
  img: string;
}

const news: NewsItem[] = [
  {
    id: 1,
    href: "/news/1",
    datetime: "2026-07-25",
    date: "2026-07-25",
    group: "Press Release",
    category: "Business | Finance",
    title: "ผลิตภัณฑ์ ARIGEO ได้รับการรับรองมาตรฐานสากล",
    img: "/images/home/news-corporate-building.png",
  },
  {
    id: 2,
    href: "/news/2",
    datetime: "2026-07-20",
    date: "2026-07-20",
    group: "Innovation",
    category: "R&D | Technology",
    title: "นวัตกรรมใหม่ในการพัฒนาผลิตภัณฑ์ที่ปลอดภัย",
    img: "/images/home/news-product-handwash.png",
  },
  {
    id: 3,
    href: "/news/3",
    datetime: "2026-07-15",
    date: "2026-07-15",
    group: "Sustainability",
    category: "Environment | CSR",
    title: "ARIGEO มุ่งสู่ความเป็นเลิศด้านความยั่งยืน",
    img: "/images/home/news-sustainability-globe.png",
  },
  {
    id: 4,
    href: "/news/4",
    datetime: "2026-07-10",
    date: "2026-07-10",
    group: "Community",
    category: "Social | Outreach",
    title: "กิจกรรมสัมพันธ์โครงการดูแลชุมชน",
    img: "/images/home/news-lifestyle-couple.png",
  },
  {
    id: 5,
    href: "/news/5",
    datetime: "2026-07-05",
    date: "2026-07-05",
    group: "Corporate",
    category: "HR | Training",
    title: "ทีมงาน ARIGEO เข้ารับการอบรมด้านความปลอดภัย",
    img: "/images/home/news-corporate-building.png",
  },
];

export default function NewsRelease() {
  return (
    <section className={s.section}>
      <div className={s.container}>
        <h2 className={s.title}>News Release</h2>

        <ul className={s.list}>
          {news.map((n) => (
            <li className={s.item} key={n.id}>
              <a className={s.link} href={n.href}>
                <div className={s.inner}>
                  <div className={s.text}>
                    <span className={s.bullet} aria-hidden="true" />
                    <p className={s.headline}>{n.title}</p>
                    <div className={s.time}>
                      <time dateTime={n.datetime}>{n.date}</time>
                    </div>
                    <div className={s.labels}>
                      <span className={s.tag}>{n.group}</span>
                      <span className={s.tag}>{n.category}</span>
                    </div>
                  </div>
                </div>
                <p className={s.thumb}>
                  <img src={n.img} alt="" loading="lazy" />
                </p>
              </a>
            </li>
          ))}
        </ul>

        <div className={s.footer}>
          <a className={s.viewAll} href="/news">
            <span className={s.viewAllIcon} aria-hidden="true" />
            <span>View all news</span>
          </a>
        </div>
      </div>
    </section>
  );
}
