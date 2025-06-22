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

  const continents = React.useMemo(
    () => Object.keys(groupedCountries),
    [groupedCountries],
  );

  const handleSelection = (key: string | null) => {
    if (!key) return;

    // Check if it's a continent (starts with 'continent:')
    if (key.startsWith("continent:")) {
      const continentName = key.replace("continent:", "");
      const continentCountries =
        groupedCountries[continentName]?.map((c) => c.code) || [];

      // Add all countries from this continent that aren't already selected
      const newCountries = continentCountries.filter(
        (code) => !selectedCountries.includes(code),
      );
      onSelectionChange([...selectedCountries, ...newCountries]);
    } else {
      // It's a country code
      if (!selectedCountries.includes(key)) {
        onSelectionChange([...selectedCountries, key]);
      }
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
      <div className="flex items-center gap-2 mb-1">
        <svg
          className="w-4 h-4 text-default-700"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-small font-medium text-default-700">
          Filter by Location
        </span>
      </div>
      <Autocomplete
        label=""
        placeholder="Search countries or select entire continents..."
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSelectionChange={handleSelection}
        size="sm"
        variant="bordered"
        className="w-full"
      >
        <AutocompleteSection title="Continents">
          {continents.map((continent) => (
            <AutocompleteItem
              key={`continent:${continent}`}
              startContent={
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-xs text-primary-600">🌍</span>
                </div>
              }
              textValue={`All ${continent}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">All {continent}</span>
                <span className="text-tiny text-default-400">
                  {groupedCountries[continent]?.length} countries
                </span>
              </div>
            </AutocompleteItem>
          ))}
        </AutocompleteSection>

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
                  avatar={
                    <Avatar
                      alt={country?.name}
                      className="w-6 h-6"
                      src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`}
                    />
                  }
                >
                  {country?.name}
                </Chip>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
