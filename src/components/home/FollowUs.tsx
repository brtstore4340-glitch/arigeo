"use client";

export default function FollowUs() {
  return (
    <section
      style={{
        display: "flex",
        minHeight: "104px",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "1px solid rgba(17,17,17,0.12)",
        padding: "20px 0",
      }}
    >
      <img
        src="/images/logo.png"
        alt="ARIGEO logo"
        style={{ height: 42, width: "auto", objectFit: "contain" }}
      />
    </section>
  );
}
