import React, { useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
  Avatar,
  Chip,
  Card,
  CardBody,
  Badge,
  Button,
} from "@heroui/react";
import type { Key } from "@react-types/shared";
import { Icon } from "@iconify/react";

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

  const handleSelection = (key: Key | null) => {
    if (!key) return;

    const keyStr = String(key);

    // Check if it's a continent selection
    if (keyStr.startsWith("continent:")) {
      const continentName = keyStr.replace("continent:", "");
      const continentCountries =
        groupedCountries[continentName]?.map((c) => c.code) || [];

      // Add all countries from this continent that aren't already selected
      const newCountries = continentCountries.filter(
        (code) => !selectedCountries.includes(code),
      );
      onSelectionChange([...selectedCountries, ...newCountries]);
    } else {
      // Individual country selection
      if (!selectedCountries.includes(keyStr)) {
        onSelectionChange([...selectedCountries, keyStr]);
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
      <div className="flex items-center gap-2">
        <Icon icon="lucide:map-pin" className="w-4 h-4 text-default-700" />
        <span className="text-small font-medium text-default-700">
          Filter by Location
        </span>
      </div>

      <Autocomplete
        label=""
        placeholder="Search countries..."
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSelectionChange={handleSelection}
        size="sm"
        variant="flat"
        className="w-full"
        classNames={{
          trigger:
            "bg-default-100 border-1 border-transparent data-[hover=true]:bg-default-200",
          input: "text-small",
          clearButton: "text-default-400",
        }}
        endContent={
          <Icon icon="lucide:search" className="text-default-400" width={16} />
        }
      >
        {Object.entries(groupedCountries).map(
          ([continent, countriesInContinent]) => {
            const availableCountries = countriesInContinent.filter(
              (country) => !selectedCountries.includes(country.code),
            );

            if (availableCountries.length === 0) return null;

            return (
              <AutocompleteSection
                key={continent}
                title={continent}
                className="mb-1"
              >
                {/* Quick continent selection */}
                <AutocompleteItem
                  key={`continent:${continent}`}
                  startContent={
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100">
                      <Icon
                        icon="lucide:globe"
                        className="w-3 h-3 text-primary-600"
                      />
                    </div>
                  }
                  textValue={`All ${continent}`}
                  className="border-b border-default-100 mb-1"
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-medium text-primary-600">
                      Select all {continent}
                    </span>
                    <span className="text-tiny text-default-400">
                      {countriesInContinent.length} countries
                    </span>
                  </div>
                </AutocompleteItem>

                {/* Individual countries */}
                {availableCountries.map((country) => (
                  <AutocompleteItem
                    key={country.code}
                    startContent={
                      <Avatar
                        alt={country.name}
                        className="w-5 h-5"
                        src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                      />
                    }
                    textValue={country.name}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span>{country.name}</span>
                      <span className="text-tiny text-default-400">
                        {country.code}
                      </span>
                    </div>
                  </AutocompleteItem>
                ))}
              </AutocompleteSection>
            );
          },
        )}
      </Autocomplete>

      {selectedCountries.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-small text-default-600">
              {selectedCountries.length} countr
              {selectedCountries.length === 1 ? "y" : "ies"} selected
            </span>
            <Button
              size="sm"
              variant="light"
              color="danger"
              onPress={handleClearAll}
              className="h-6 min-w-unit-16 text-tiny"
            >
              Clear all
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto p-2 border border-default-200 rounded-medium">
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
                      className="w-5 h-5"
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
