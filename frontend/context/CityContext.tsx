"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CITIES_DATA, DEFAULT_CITY, getCityAreas, CityData } from "@/data/cities";

interface CityContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  cities: CityData[];
  areas: string[];
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [selectedCity, setSelectedCityState] = useState<string>(DEFAULT_CITY);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("shimoga_preferred_city");
      if (saved) {
        const found = CITIES_DATA.find(
          (c) => c.name.toLowerCase() === saved.toLowerCase() || c.id === saved.toLowerCase()
        );
        if (found) {
          setSelectedCityState(found.name);
        }
      }
    } catch {
      // LocalStorage access failsafe (e.g. incognito/SSR)
    }
  }, []);

  const setSelectedCity = (cityName: string) => {
    setSelectedCityState(cityName);
    try {
      localStorage.setItem("shimoga_preferred_city", cityName);
    } catch {
      // ignore
    }
  };

  const areas = getCityAreas(selectedCity);

  return (
    <CityContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        cities: CITIES_DATA,
        areas,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error("useCity must be used within a CityProvider");
  }
  return context;
}
