"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ServicesRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const query = params.toString();
    const targetUrl = query ? `/?${query}#businesses` : "/#businesses";
    router.replace(targetUrl);
  }, [router, searchParams]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
        color: "#64748b",
      }}
    >
      <div style={{ fontSize: "1.05rem", fontWeight: 600, color: "#0f172a" }}>
        Loading business directory...
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>
          Loading directory...
        </div>
      }
    >
      <ServicesRedirectContent />
    </Suspense>
  );
}
