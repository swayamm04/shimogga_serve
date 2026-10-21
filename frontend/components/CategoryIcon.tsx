"use client";

import React from "react";
import {
  Stethoscope,
  UtensilsCrossed,
  Wrench,
  Car,
  GraduationCap,
  Sparkles,
  Building2,
  ShoppingBag,
  Truck,
  Camera,
  HeartPulse,
  Briefcase,
  Home,
  Shield,
  Layers,
} from "lucide-react";

interface CategoryIconProps {
  slug?: string;
  name?: string;
  iconName?: string;
  size?: number;
  className?: string;
  color?: string;
}

export default function CategoryIcon({
  slug = "",
  name = "",
  iconName = "",
  size = 20,
  className = "",
  color = "currentColor",
}: CategoryIconProps) {
  const normalized = (slug || name || iconName).toLowerCase();

  if (normalized.includes("health") || normalized.includes("hospital") || normalized.includes("doctor") || normalized.includes("clinic") || normalized.includes("stethoscope")) {
    return <Stethoscope size={size} color={color} className={className} />;
  }
  if (normalized.includes("restaurant") || normalized.includes("cafe") || normalized.includes("food") || normalized.includes("dining") || normalized.includes("utensil")) {
    return <UtensilsCrossed size={size} color={color} className={className} />;
  }
  if (normalized.includes("home") || normalized.includes("clean") || normalized.includes("repair") || normalized.includes("plumb") || normalized.includes("wrench")) {
    return <Wrench size={size} color={color} className={className} />;
  }
  if (normalized.includes("auto") || normalized.includes("garage") || normalized.includes("car") || normalized.includes("bike") || normalized.includes("mechanic")) {
    return <Car size={size} color={color} className={className} />;
  }
  if (normalized.includes("educat") || normalized.includes("school") || normalized.includes("college") || normalized.includes("coach") || normalized.includes("graduation")) {
    return <GraduationCap size={size} color={color} className={className} />;
  }
  if (normalized.includes("beauty") || normalized.includes("salon") || normalized.includes("spa") || normalized.includes("hair")) {
    return <Sparkles size={size} color={color} className={className} />;
  }
  if (normalized.includes("real-estate") || normalized.includes("builder") || normalized.includes("contractor") || normalized.includes("property")) {
    return <Building2 size={size} color={color} className={className} />;
  }
  if (normalized.includes("retail") || normalized.includes("shop") || normalized.includes("store") || normalized.includes("saree") || normalized.includes("jewel")) {
    return <ShoppingBag size={size} color={color} className={className} />;
  }
  if (normalized.includes("transport") || normalized.includes("logistic") || normalized.includes("packers")) {
    return <Truck size={size} color={color} className={className} />;
  }
  if (normalized.includes("photo") || normalized.includes("video") || normalized.includes("studio")) {
    return <Camera size={size} color={color} className={className} />;
  }

  return <Layers size={size} color={color} className={className} />;
}
