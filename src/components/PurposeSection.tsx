import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { BadgeCheck, BookOpen, Sparkles } from "lucide-react";

const cards = [
  { key: "innovation", icon: BookOpen },
  { key: "sustainability", icon: Sparkles },
  { key: "safety", icon: BadgeCheck },
] as const;

export default function PurposeSection() {
  const about = useTranslations("About");
  const values = useTranslations("Values");
  const navigation = useTranslations("Navigation");

  return (
    <section className="section shell purpose-section" aria-labelledby="story-title">
      <div className="purpose-grid">
        <div className="purpose-intro">
          <h2 id="story-title">{about("storyTitle")}</h2>
          <p>{about("storyText")}</p>
          <Link href="/about" className="purpose-cta">
            {navigation("about")}
          </Link>
        </div>

        <div className="purpose-cards">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <article className="purpose-card" key={card.key}>
                <div className="purpose-card__icon" aria-hidden="true">
                  <Icon size={22} />
                </div>
                <h3>{values(`${card.key}.title`)}</h3>
                <p>{values(`${card.key}.description`)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
