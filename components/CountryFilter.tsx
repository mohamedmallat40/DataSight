import React, { useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
  Avatar,
  Chip,
} from "@heroui/react";

import { countries } from "../data/countries";
import { groupCountriesByContinent } from "../utils/countryUtils";

interface CountryFilterProps {
  selectedCountries: string[];
  onSelectionChange: (countries: string[]) => void;
  className?: string;
}

export default function CountryFilter({
  selectedCountries,
  onSelectionChange,
  className,
}: CountryFilterProps) {
  const [inputValue, setInputValue] = useState("");

  const groupedCountries = React.useMemo(
    () => groupCountriesByContinent(countries),
    [],
  );

  const handleCountrySelect = (countryCode: string | null) => {
    if (!countryCode) return;

    if (!selectedCountries.includes(countryCode)) {
      onSelectionChange([...selectedCountries, countryCode]);
    }
    setInputValue("");
  };

  const handleRemoveCountry = (countryCode: string) => {
    onSelectionChange(selectedCountries.filter((code) => code !== countryCode));
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className={`flex flex-col gap-3 w-full ${className || ""}`}>
      <Autocomplete
        label="Filter by countries"
        placeholder="Search and select countries..."
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSelectionChange={handleCountrySelect}
        size="sm"
        variant="bordered"
        className="w-full"
      >
        {Object.entries(groupedCountries).map(
          ([continent, countriesInContinent]) => (
            <AutocompleteSection key={continent} title={continent}>
              {countriesInContinent
                .filter((country) => !selectedCountries.includes(country.code))
                .map((country) => (
                  <AutocompleteItem
                    key={country.code}
                    startContent={
                      <Avatar
                        alt={country.name}
                        className="w-6 h-6"
                        src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                      />
                    }
                    textValue={country.name}
                  >
                    <div className="flex justify-between items-center">
                      <span>{country.name}</span>
                      <span className="text-tiny text-default-400">
                        {country.code}
                      </span>
                    </div>
                  </AutocompleteItem>
                ))}
            </AutocompleteSection>
          ),
        )}
      </Autocomplete>

      {selectedCountries.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-small text-default-600">
              {selectedCountries.length} countr
              {selectedCountries.length === 1 ? "y" : "ies"} selected
            </span>
            <button
              onClick={handleClearAll}
              className="text-tiny text-primary hover:text-primary-600 cursor-pointer"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto p-2 border border-default-200 rounded-medium">
            {selectedCountries.map((countryCode) => {
              const country = countries.find((c) => c.code === countryCode);
              return (
                <Chip
                  key={countryCode}
                  onClose={() => handleRemoveCountry(countryCode)}
                  variant="flat"
                  color="primary"
                  size="sm"
                  startContent={
                    <img
                      alt={country?.name}
                      className="w-3 h-3 rounded-sm object-cover flex-shrink-0"
                      src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  }
                >
                  <div className="flex flex-col items-start min-w-0">
                    <span className="text-tiny font-medium truncate">
                      {country?.name}
                    </span>
                    <span className="text-tiny text-default-400 truncate">
                      {country?.continent}
                    </span>
                  </div>
                </Chip>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
