"use client";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#010101",
        color: "#fff",
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1420px",
          marginInline: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {/* Logo */}
        <div>
          <img
            src="/images/brands/arigeo.png"
            alt="ARIGEO"
            style={{
              height: "40px",
              width: "auto",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Social Media Icons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <a
            href="#"
            title="Facebook"
            aria-label="Facebook"
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.7,
              transition: "opacity 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
          >
            <img
              src="/images/social/facebook.png"
              alt="Facebook"
              style={{
                width: "24px",
                height: "24px",
                objectFit: "contain",
              }}
            />
          </a>

          <a
            href="#"
            title="Instagram"
            aria-label="Instagram"
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.7,
              transition: "opacity 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
          >
            <img
              src="/images/social/instagram.png"
              alt="Instagram"
              style={{
                width: "24px",
                height: "24px",
                objectFit: "contain",
              }}
            />
          </a>

          <a
            href="#"
            title="YouTube"
            aria-label="YouTube"
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.7,
              transition: "opacity 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
          >
            <img
              src="/images/social/youtube.png"
              alt="YouTube"
              style={{
                width: "24px",
                height: "24px",
                objectFit: "contain",
              }}
            />
          </a>

          <a
            href="#"
            title="TikTok"
            aria-label="TikTok"
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.7,
              transition: "opacity 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
          >
            <img
              src="/images/social/tiktok.png"
              alt="TikTok"
              style={{
                width: "24px",
                height: "24px",
                objectFit: "contain",
              }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
