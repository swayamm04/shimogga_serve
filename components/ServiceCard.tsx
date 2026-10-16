"use client";

import { Service } from "@/data/services";

interface ServiceCardProps {
  service: Service;
  accentColor?: string;
  delay?: number;
}

export default function ServiceCard({ service, accentColor = "#FF6B00", delay = 0 }: ServiceCardProps) {
  return (
    <div
      className="service-card"
      style={{
        "--card-accent": accentColor,
        animationDelay: `${delay}ms`,
      } as React.CSSProperties}
    >
      {/* Badges */}
      {(service.popular || service.isNew) && (
        <div className="card-badges">
          {service.popular && <span className="badge badge-popular">Popular</span>}
          {service.isNew && <span className="badge badge-new">New</span>}
        </div>
      )}

      {/* Icon */}
      <div className="card-icon">{service.icon}</div>

      {/* Name */}
      <div className="card-name">{service.name}</div>

      {/* Description */}
      <p className="card-desc">{service.description}</p>

      {/* Footer row */}
      <div className="card-footer">
        <div>
          <div className="card-price">{service.price}</div>
          <div className="card-price-label">starting from</div>
        </div>
        <div className="card-duration">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          {service.duration}
        </div>
      </div>

      {/* Book button */}
      <button className="card-book-btn" style={{ background: accentColor }}>
        Book Now
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </svg>
      </button>
    </div>
  );
}
