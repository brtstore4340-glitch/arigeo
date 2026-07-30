"use client";

interface SocialLink {
  id: string;
  name: string;
  icon: string;
  href?: string;
  label: string;
}

const socialLinks: SocialLink[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "/images/social/facebook.png",
    label: "LinkedIn — Awaiting official URL",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "/images/social/instagram.png",
    label: "Instagram — Awaiting official URL",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "/images/social/youtube.png",
    label: "YouTube — Awaiting official URL",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "/images/social/facebook.png",
    label: "Facebook — Awaiting official URL",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "/images/social/tiktok.png",
    label: "TikTok — Awaiting official URL",
  },
];

export default function FollowUs() {
  return (
    <section
      style={{
        display: "flex",
        minHeight: "104px",
        alignItems: "center",
        justifyContent: "center",
        gap: "28px",
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
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {socialLinks.map((link) => (
          <button
            key={link.id}
            type="button"
            title={link.label}
            aria-label={link.label}
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "999px",
              display: "grid",
              placeItems: "center",
              background: "#fff",
              color: "#111",
              border: "1px solid rgba(17,17,17,0.16)",
              cursor: link.href ? "pointer" : "help",
              padding: 0,
            }}
          >
            <img
              src={link.icon}
              alt={link.name}
              style={{
                width: "24px",
                height: "24px",
                objectFit: "contain",
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
