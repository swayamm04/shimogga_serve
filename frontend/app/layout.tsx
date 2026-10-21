import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CityProvider } from "@/context/CityContext";

export const metadata: Metadata = {
  title: "Karnataka Local Services Directory — Shivamogga & Multi-City Business Network",
  description:
    "Official local business and public service directory for Shivamogga, Bengaluru, Mysuru, and Karnataka cities. Direct phone & WhatsApp access to verified hospitals, restaurants, home services, clinics, and local merchants.",
  keywords: [
    "Shivamogga services",
    "Shimoga business directory",
    "Karnataka local services",
    "hospitals in Shimoga",
    "doctors in Shivamogga",
    "restaurants in Shimoga",
    "home repairs Shimoga",
    "electrician plumber Shivamogga",
    "emergency helpline Shivamogga",
  ],
  openGraph: {
    title: "Karnataka Local Services Directory — Verified Business Network",
    description:
      "Connect directly with verified local doctors, restaurants, contractors, and merchants across Shivamogga and Karnataka cities with zero commission fees.",
    url: "http://localhost:3000",
    type: "website",
    siteName: "Local Services Directory",
  },
  robots: {
    index: true,
    follow: true,
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <CityProvider>
            <Navbar />
            {children}
            <Footer />
          </CityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
