"use client";

import { Service } from "@/data/services";
import CategoryIcon from "./CategoryIcon";

interface ServiceCardProps {
  service: Service;
  accentColor?: string;
  delay?: number;
}

export default function ServiceCard({ service, accentColor = "#0f2942", delay = 0 }: ServiceCardProps) {
  return (
    <div
      className="card"
      style={{
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        {/* Badges */}
        {(service.popular || service.isNew) && (
          <div style={{ display: "flex", gap: "0.35rem", marginBottom: "0.6rem" }}>
            {service.popular && <span className="badge-sponsor">Popular</span>}
            {service.isNew && <span className="badge-verified">New</span>}
          </div>
        )}

        {/* Icon */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "6px",
            background: "#eff6ff",
            color: "#1e40af",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "0.6rem",
          }}
        >
          <CategoryIcon name={service.name} iconName={service.iconName} size={18} color="#1e40af" />
        </div>

        {/* Name */}
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.25rem" }}>
          {service.name}
        </h3>

        {/* Description */}
        <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1rem" }}>
          {service.description}
        </p>
      </div>

      {/* Footer row */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "0.75rem", borderBottom: "1px solid #f1f5f9", marginBottom: "0.75rem", fontSize: "0.85rem" }}>
          <div>
            <div style={{ fontWeight: 800, color: "#0f172a" }}>{service.price}</div>
            <div style={{ fontSize: "0.72rem", color: "#64748b" }}>starting estimate</div>
          </div>
          <div style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 500 }}>
            {service.duration}
          </div>
        </div>

        {/* Action button */}
        <button
          className="btn-primary"
          style={{ width: "100%", padding: "0.55rem", fontSize: "0.85rem" }}
        >
          Direct Contact
        </button>
      </div>
    </div>
  );
}
