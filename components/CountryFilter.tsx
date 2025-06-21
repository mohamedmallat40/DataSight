import React from "react";
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
  const groupedCountries = React.useMemo(
    () => groupCountriesByContinent(countries),
    [],
  );

  const handleSelectionChange = (keys: any) => {
    // Handle both Set and string array formats
    const keysArray =
      keys instanceof Set ? Array.from(keys) : Array.isArray(keys) ? keys : [];
    const uniqueKeys = [...new Set(keysArray)];
    onSelectionChange(uniqueKeys);
  };

  const handleRemoveCountry = (countryKey: string) => {
    onSelectionChange(selectedCountries.filter((key) => key !== countryKey));
  };

  return (
    <div className={`flex flex-col gap-4 w-full ${className || ""}`}>
      <Autocomplete
        label="Filter by countries"
        placeholder="Search and select countries..."
        selectionMode="multiple"
        selectedKeys={new Set(selectedCountries)}
        onSelectionChange={handleSelectionChange}
        className="max-h-[300px] overflow-y-auto"
        size="sm"
        variant="bordered"
        allowsCustomValue={false}
        menuTrigger="input"
        disabledKeys={new Set(selectedCountries)}
      >
        {Object.entries(groupedCountries).map(
          ([continent, countriesInContinent]) => (
            <AutocompleteSection key={continent} title={continent}>
              {countriesInContinent.map((country) => (
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
              onClick={() => onSelectionChange([])}
              className="text-tiny text-primary hover:text-primary-600 cursor-pointer"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto p-2 border border-default-200 rounded-medium">
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
                      className="w-4 h-4 rounded-full object-cover"
                      src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  }
                >
                  <div className="flex flex-col items-start">
                    <span className="text-tiny font-medium">
                      {country?.name}
                    </span>
                    <span className="text-tiny text-default-400">
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
