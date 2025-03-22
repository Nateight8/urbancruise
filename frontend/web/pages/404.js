// This is a minimal 404 page that doesn't use client-side hooks
import Link from "next/link";

export default function Custom404() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "1.5rem",
        textAlign: "center",
      }}
    >
      <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        404 - Page Not Found
      </h1>
      <p style={{ marginBottom: "2rem" }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#0070f3",
          color: "white",
          borderRadius: "0.375rem",
          textDecoration: "none",
        }}
      >
        Return Home
      </Link>
    </div>
  );
}
