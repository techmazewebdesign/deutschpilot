import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="de">
      <body style={{ margin: 0, backgroundColor: "#071424", fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "28rem" }}>
            <div
              style={{
                display: "inline-block",
                fontSize: "5rem",
                fontWeight: 700,
                color: "#CEA66F",
                lineHeight: 1,
                marginBottom: "1rem",
                opacity: 0.4,
              }}
            >
              404
            </div>
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "#F5F1E8",
                marginBottom: "0.75rem",
              }}
            >
              Page not found
            </h1>
            <p style={{ color: "#C9D2DE", marginBottom: "2rem" }}>
              The page you are looking for does not exist or has been moved.
            </p>
            <Link
              href="/de"
              style={{
                display: "inline-block",
                backgroundColor: "#D9B173",
                color: "#071424",
                fontWeight: 600,
                padding: "0.75rem 2rem",
                borderRadius: "0.375rem",
                textDecoration: "none",
              }}
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
