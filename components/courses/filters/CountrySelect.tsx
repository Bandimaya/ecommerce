import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

// --- Data: Common Countries List ---
// In a real app, you might import this from a large JSON file.
const COUNTRIES = [
  { name: "India", code: "IN", dial_code: "+91", flag: "https://flagcdn.com/w40/in.png" },
  { name: "United States", code: "US", dial_code: "+1", flag: "https://flagcdn.com/w40/us.png" },
  { name: "United Kingdom", code: "GB", dial_code: "+44", flag: "https://flagcdn.com/w40/gb.png" },
  { name: "Canada", code: "CA", dial_code: "+1", flag: "https://flagcdn.com/w40/ca.png" },
  { name: "Australia", code: "AU", dial_code: "+61", flag: "https://flagcdn.com/w40/au.png" },
  { name: "United Arab Emirates", code: "AE", dial_code: "+971", flag: "https://flagcdn.com/w40/ae.png" },
  { name: "Singapore", code: "SG", dial_code: "+65", flag: "https://flagcdn.com/w40/sg.png" },
  { name: "Germany", code: "DE", dial_code: "+49", flag: "https://flagcdn.com/w40/de.png" },
  { name: "France", code: "FR", dial_code: "+33", flag: "https://flagcdn.com/w40/fr.png" },
  { name: "Andorra", code: "AD", dial_code: "+376", flag: "https://flagcdn.com/w40/ad.png" },
];

interface CountrySelectProps {
  value: string;
  onChange: (phone: string) => void;
  error?: string;
}

export default function CountrySelect({ value, onChange, error }: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // Default to India
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter countries based on search
  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dial_code.includes(searchQuery)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery(""); // Reset search
    // Optionally trigger onChange here if you want to include the dial code immediately
  };

  return (
    <div className="space-y-1" ref={dropdownRef}>
      <div className="relative group">
        
        {/* --- 1. The Main Input Container --- */}
        <div 
          className={`flex items-center w-full bg-white/50 border-2 rounded-xl transition-all duration-200
          ${error 
            ? "border-red-200 bg-red-50 focus-within:border-red-500" 
            : "border-gray-200 focus-within:bg-white focus-within:border-orange-500 focus-within:shadow-[0_4px_10px_rgba(249,115,22,0.1)] hover:border-gray-300"
          }`}
        >
          
          {/* A. Country Trigger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 pl-3 pr-2 py-3 border-r border-gray-200 hover:bg-gray-50 rounded-l-xl transition-colors outline-none"
          >
            <img
              src={selectedCountry.flag}
              alt={selectedCountry.code}
              className="w-6 h-4 object-cover rounded-[2px] shadow-sm"
              loading="lazy"
            />
            <span className="text-sm font-semibold text-gray-700">
              {selectedCountry.dial_code}
            </span>
            <ChevronDown 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* B. The Phone Input */}
          <input
            type="tel"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Phone Number"
            className="w-full pl-3 pr-3 py-3 bg-transparent outline-none text-gray-900 font-medium placeholder:text-gray-400"
          />
        </div>

        {/* --- 2. The Dropdown Menu --- */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-full sm:w-72 max-h-60 bg-white border border-gray-100 rounded-xl shadow-xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            
            {/* Search Bar */}
            <div className="sticky top-0 bg-gray-50 border-b border-gray-100 p-2 z-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 p-1">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelect(country)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors
                      ${selectedCountry.code === country.code 
                        ? "bg-orange-50 text-orange-700 font-medium" 
                        : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={country.flag}
                        alt={country.name}
                        className="w-5 h-3.5 object-cover rounded-[1px] shadow-sm"
                      />
                      <span className="truncate">{country.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">{country.dial_code}</span>
                      {selectedCountry.code === country.code && (
                        <Check className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No country found
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating Label (optional, for visual consistency with InputField) */}
        <label className={`absolute left-[5.5rem] text-gray-500 text-sm transition-all duration-200 pointer-events-none
          ${value 
            ? "-top-2.5 text-xs font-semibold px-1 bg-white ml-[-4px] text-orange-600" 
            : "top-3.5"
          }
          ${error ? "text-red-500" : ""}
        `}>
          {!value && "Phone Number"}
        </label>

      </div>
      
      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-500 mt-1 ml-1 font-semibold flex items-center">
          {error}
        </p>
      )}
    </div>
  );
}