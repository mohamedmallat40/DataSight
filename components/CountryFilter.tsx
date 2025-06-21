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
      <Autocomplete
        label="Filter by countries or continents"
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
