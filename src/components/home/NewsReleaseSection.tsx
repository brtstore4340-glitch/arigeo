"use client";

/**
 * NewsReleaseSection
 * Press releases and news listing (Kao-style pattern)
 *
 * Design System Spec:
 * - Title: "ข่าวประชาสัมพันธ์" (News Release)
 * - 5 news items with date, category, title, image
 * - Date format: YYYY-MM-DD
 * - Right-aligned image layout
 */

interface NewsItem {
  id: string;
  date: string;
  category: string;
  title: string;
  href: string;
  image: string;
}

const newsItems: NewsItem[] = [
  {
    id: "news-001",
    date: "2026-07-28",
    category: "ธุรกิจ | การเงิน",
    title: "ARIGEO เปิดตัวสายผลิตภัณฑ์ใหม่ที่มุ่งเน้นความยั่งยืนและนวัตกรรม",
    href: "#",
    image: "/images/home/hero-products.png",
  },
  {
    id: "news-002",
    date: "2026-07-25",
    category: "การวิจัยและพัฒนา",
    title: "ศูนย์วิจัยและพัฒนา ARIGEO ประกาศความสำเร็จในการพัฒนาส่วนผสมใหม่",
    href: "#",
    image: "/images/home/purpose-innovation.png",
  },
  {
    id: "news-003",
    date: "2026-07-20",
    category: "การพัฒนาอย่างยั่งยืน",
    title: "ARIGEO มุ่งมั่นสู่การจัดการของเสียแบบวงกลม ลดการปล่อยคาร์บอน 50%",
    href: "#",
    image: "/images/home/purpose-sustainability-alt.jpg",
  },
  {
    id: "news-004",
    date: "2026-07-15",
    category: "ข่าวประชาสัมพันธ์",
    title: "ARIGEO ได้รับรองเป็นบริษัทที่ดีที่สุดในการทำงาน 2026",
    href: "#",
    image: "/images/home/team-culture-1.png",
  },
  {
    id: "news-005",
    date: "2026-07-10",
    category: "ธุรกิจ | การเงิน",
    title: "ARIGEO ขยายตลาดในภูมิภาค東南亚ผ่านการเชื่อมต่อกับตัวแทนจำหน่ายชั้นนำ",
    href: "#",
    image: "/images/home/hero-lifestyle-innovation.jpg",
  },
];

export default function NewsReleaseSection() {
  return (
    <section className="news-release-section">
      <div className="news-release-container">
        {/* Section Title */}
        <div className="news-release-header">
          <h2 className="news-release-title">ข่าวประชาสัมพันธ์</h2>
        </div>

        {/* News List */}
        <div className="news-release-list">
          {newsItems.map((item) => (
            <a key={item.id} href={item.href} className="news-release-item">
              <div className="news-release-content">
                <p className="news-release-text">{item.title}</p>

                <div className="news-release-info">
                  <time className="news-release-date">{item.date}</time>
                  <span className="news-release-category">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="news-release-image">
                <img src={item.image} alt={item.title} />
              </div>
            </a>
          ))}
        </div>

        {/* View All Link */}
        <div className="news-release-footer">
          <a href="#" className="news-release-view-all">
            ข่าวสารทั้งหมด →
          </a>
        </div>
      </div>
    </section>
  );
}
