"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MEGA_CATEGORIES, MegaCategory } from "@/data/categoriesMegaMenu";
import {
  Hotel,
  HeartPulse,
  Utensils,
  Car,
  Wrench,
  GraduationCap,
  Building2,
  Shirt,
  Smartphone,
  Sparkles,
  Armchair,
  Landmark,
  Printer,
  Briefcase,
  ShoppingBag,
  Laptop,
  Layers,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
} from "lucide-react";

interface CategoriesMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
}

function getCategoryIcon(iconName: string) {
  switch (iconName) {
    case "Hotel":
      return Hotel;
    case "HeartPulse":
      return HeartPulse;
    case "Utensils":
      return Utensils;
    case "Car":
      return Car;
    case "Wrench":
      return Wrench;
    case "GraduationCap":
      return GraduationCap;
    case "Building2":
      return Building2;
    case "Shirt":
      return Shirt;
    case "Smartphone":
      return Smartphone;
    case "Sparkles":
      return Sparkles;
    case "Armchair":
      return Armchair;
    case "Landmark":
      return Landmark;
    case "Printer":
      return Printer;
    case "Briefcase":
      return Briefcase;
    case "ShoppingBag":
      return ShoppingBag;
    case "Laptop":
      return Laptop;
    default:
      return Layers;
  }
}

export default function CategoriesMegaMenu({
  isOpen,
  onClose,
  selectedCity,
}: CategoriesMegaMenuProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<MegaCategory>(MEGA_CATEGORIES[0]);
  const menuRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = tabsContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(checkScroll, 120);
      window.addEventListener("resize", checkScroll);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [isOpen]);

  // Translate vertical mouse wheel over tabs to horizontal scroll
  useEffect(() => {
    const el = tabsContainerRef.current;
    if (!el || !isOpen) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
        checkScroll();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isOpen]);

  const handleScroll = (direction: "left" | "right") => {
    const el = tabsContainerRef.current;
    if (!el) return;
    const amount = 320;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 350);
  };

  const handleCategorySelect = (cat: MegaCategory, targetEl: HTMLElement) => {
    setActiveCategory(cat);
    targetEl.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Close on click outside (ignoring clicks on the trigger button)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest?.(".categories-trigger")) {
        return;
      }
      if (menuRef.current && !menuRef.current.contains(target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubcategoryClick = (sub: string) => {
    onClose();
    const targetUrl = `/?city=${encodeURIComponent(selectedCity)}&category=${activeCategory.slug}&search=${encodeURIComponent(
      sub
    )}#businesses`;
    router.push(targetUrl);
    setTimeout(() => {
      document.getElementById("businesses")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleExploreAllClick = () => {
    onClose();
    const targetUrl = `/?city=${encodeURIComponent(selectedCity)}&category=${activeCategory.slug}#businesses`;
    router.push(targetUrl);
    setTimeout(() => {
      document.getElementById("businesses")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: "fixed",
        top: "4.25rem",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 995,
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(3px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "0.5rem",
        animation: "fadeIn 0.15s ease-out",
      }}
    >
      <div
        ref={menuRef}
        style={{
          width: "min(1160px, 96vw)",
          background: "#ffffff",
          borderRadius: "14px",
          boxShadow:
            "0 25px 60px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "calc(90vh - 4.5rem)",
          animation: "slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* ── TOP HORIZONTAL CATEGORY TABS BAR WITH PROFESSIONAL ICONS & SCROLL CONTROLS ── */}
        <div
          style={{
            position: "relative",
            background: "#081d2c",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Scroll Left Button */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll("left")}
              aria-label="Scroll categories left"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "44px",
                zIndex: 10,
                background:
                  "linear-gradient(90deg, #081d2c 60%, rgba(8, 29, 44, 0) 100%)",
                border: "none",
                color: "#f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingLeft: "0.5rem",
                cursor: "pointer",
                transition: "opacity 0.2s ease",
              }}
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Horizontally scrollable tabs list */}
          <div
            ref={tabsContainerRef}
            onScroll={checkScroll}
            style={{
              display: "flex",
              alignItems: "center",
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              padding: "0.5rem 1.25rem 0",
              gap: "0.35rem",
              scrollBehavior: "smooth",
              flex: 1,
            }}
          >
            {MEGA_CATEGORIES.map((cat) => {
              const isActive = activeCategory.id === cat.id;
              const CatIcon = getCategoryIcon(cat.icon);
              return (
                <button
                  key={cat.id}
                  onClick={(e) => handleCategorySelect(cat, e.currentTarget)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.5rem 0.85rem 0.65rem",
                    background: isActive ? "rgba(255, 255, 255, 0.12)" : "transparent",
                    border: "none",
                    borderBottom: isActive ? "3px solid #f59e0b" : "3px solid transparent",
                    borderRadius: "6px 6px 0 0",
                    color: isActive ? "#ffffff" : "#94a3b8",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "all 0.15s ease",
                    fontSize: "0.78rem",
                    fontWeight: isActive ? 700 : 500,
                    gap: "0.35rem",
                  }}
                  title={cat.name}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "6px",
                      background: isActive ? "#f59e0b" : "rgba(255, 255, 255, 0.08)",
                      color: isActive ? "#0f172a" : "#cbd5e1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <CatIcon size={16} />
                  </div>
                  <span>{cat.shortName}</span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          {canScrollRight && (
            <button
              onClick={() => handleScroll("right")}
              aria-label="Scroll categories right"
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "44px",
                zIndex: 10,
                background:
                  "linear-gradient(270deg, #081d2c 60%, rgba(8, 29, 44, 0) 100%)",
                border: "none",
                color: "#f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: "0.5rem",
                cursor: "pointer",
                transition: "opacity 0.2s ease",
              }}
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>

        {/* ── BODY: LEFT SIDEBAR & RIGHT SUBCATEGORIES ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(250px, 280px) 1fr",
            flexGrow: 1,
            overflow: "hidden",
            minHeight: "380px",
          }}
        >
          {/* Left Hero Sidebar with Professional Photography Background */}
          <div
            style={{
              position: "relative",
              color: "#ffffff",
              padding: "2rem 1.6rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              overflow: "hidden",
              minHeight: "380px",
            }}
          >
            {/* Background Category Image */}
            <img
              src={activeCategory.image}
              alt={activeCategory.name}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "opacity 0.3s ease",
              }}
            />

            {/* Dark Gradient Overlay for Contrast */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(8, 29, 44, 0.5) 0%, rgba(8, 29, 44, 0.9) 65%, rgba(8, 29, 44, 0.98) 100%)",
              }}
            />

            {/* Content on top */}
            <div style={{ position: "relative", zIndex: 2 }}>

              <h3
                style={{
                  fontSize: "1.45rem",
                  fontWeight: 800,
                  color: "#ffffff",
                  lineHeight: 1.25,
                  marginBottom: "0.45rem",
                }}
              >
                {activeCategory.name}
              </h3>

              <p
                style={{
                  fontSize: "0.82rem",
                  color: "#cbd5e1",
                  lineHeight: 1.5,
                  marginBottom: "1.2rem",
                }}
              >
                {activeCategory.description}
              </p>

              <button
                onClick={handleExploreAllClick}
                className="btn-primary"
                style={{
                  padding: "0.55rem 1rem",
                  fontSize: "0.82rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  width: "100%",
                  justifyContent: "center",
                  background: "#ea580c",
                  borderColor: "#ea580c",
                }}
              >
                <span>Explore all in {selectedCity}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Subcategories Grid */}
          <div
            style={{
              padding: "1.75rem 2rem",
              background: "#ffffff",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header: Title + Close Button */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "1rem",
                borderBottom: "1px solid #f1f5f9",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  SUB CATEGORIES
                </span>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginTop: "0.15rem" }}>
                  {activeCategory.name} in {selectedCity}
                </h4>
              </div>

              <button
                onClick={onClose}
                aria-label="Close categories menu"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "none",
                  background: "#f1f5f9",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e2e8f0";
                  e.currentTarget.style.color = "#0f172a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f1f5f9";
                  e.currentTarget.style.color = "#64748b";
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Subcategory Pills/Buttons Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "0.75rem",
                alignContent: "start",
              }}
            >
              {activeCategory.subcategories.map((sub, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubcategoryClick(sub)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.7rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    background: "#ffffff",
                    color: "#1e293b",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    gap: "0.5rem",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#ea580c";
                    e.currentTarget.style.background = "#fff7ed";
                    e.currentTarget.style.color = "#ea580c";
                    e.currentTarget.style.transform = "translateX(2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.color = "#1e293b";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", minWidth: 0 }}>
                    <ChevronRight size={14} color="#ea580c" style={{ flexShrink: 0 }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {sub}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
