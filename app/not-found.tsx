import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        textAlign: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "64px", margin: "0 0 10px 0", fontWeight: 800 }}>404</h1>
      <p style={{ fontSize: "20px", margin: "0 0 20px 0", color: "#666" }}>
        Page Not Found
      </p>
      <Link
        href="/en"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "#D50306",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: 700,
          fontSize: "14px",
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
