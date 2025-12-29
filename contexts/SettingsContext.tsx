"use client";

import { apiFetch } from "@/lib/axios";
import { countryToCurrency } from "@/lib/constants";
import { useMobile } from "@/hooks/useMobile";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type ContactType = {
  email: string;
  phone: string;
  logo_url: string;
  address: string;
  hours: string;
};

type SettingsContextType = {
  contact: ContactType | null;
  setContact: (data: ContactType) => void;
  loading: boolean;
  isIndia: boolean;
  countryCode: string;
  currencyCode: string;
  isMobile: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [contact, setContact] = useState<ContactType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isIndia, setIsIndia] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const isMobile = useMobile();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiFetch("/contact");
        setContact(res);
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    };

    const cachedLocation = localStorage.getItem("user-location");

    if (cachedLocation) {
      setIsIndia(cachedLocation === "IN");
      setCountryCode(cachedLocation);
      setCurrencyCode(countryToCurrency?.[cachedLocation] ?? "USD");
    } else {
      // Only fetch if we don't know the location yet
      fetch("https://ipapi.co/json/")
        .then((res) => {
          if (res.status === 429) throw new Error("Rate limit hit");
          return res.json();
        })
        .then((data) => {
          const countryCode = data.country_code; // "IN", "US", etc.
          const isInd = countryCode === "IN";
          setIsIndia(isInd);
          setCountryCode(countryCode);
          setCurrencyCode(countryToCurrency[countryCode] ?? "USD");
          localStorage.setItem("user-location", countryCode);
        })
        .catch((err) => {
          console.warn("Location API unavailable, defaulting to India:", err);
          // Default stays India, or you can show a country selector popup
        });
    }

    fetchSettings();
  }, []);

  console.log(countryCode);

  return (
    <SettingsContext.Provider
      value={{
        contact,
        setContact,
        loading,
        isIndia,
        countryCode,
        currencyCode,
        isMobile,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return context;
};
