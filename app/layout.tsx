import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "All Home Services in Coimbatore — Book in 60 Seconds | Snapsy",
  description:
    "Browse and book Snapsy home services in Coimbatore: cleaning, mopping, dishwashing, laundry, gardening, errands, grocery runs, parcel pickup and more. Verified helpers, arrival in ~15 minutes, from ₹49.",
  keywords: [
    "Snapsy",
    "on demand services Coimbatore",
    "home cleaning Coimbatore",
    "errand service Coimbatore",
    "grocery run Coimbatore",
    "verified helpers India",
  ],
  openGraph: {
    title: "All Home Services in Coimbatore | Snapsy",
    description:
      "Cleaning, errands, grocery runs, laundry and more — verified helpers at your door in ~15 minutes, from ₹49.",
    url: "https://www.snapsy.co.in/services",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snapsy – On-Demand Home Services in Coimbatore",
    description:
      "On-demand life operations for urban India. Trusted helpers for cleaning, errands, grocery runs & more. Under 15 min arrival, from ₹49.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
