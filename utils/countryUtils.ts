import type { Country } from "../data/countries";

export function groupCountriesByContinent(
  countries: Country[],
): Record<string, Country[]> {
  return countries.reduce(
    (acc, country) => {
      if (!acc[country.continent]) {
        acc[country.continent] = [];
      }
      acc[country.continent].push(country);
      return acc;
    },
    {} as Record<string, Country[]>,
  );
}

export function findCountryByCode(
  countries: Country[],
  code: string,
): Country | undefined {
  return countries.find((country) => country.code === code);
}

export function findCountryByName(
  countries: Country[],
  name: string,
): Country | undefined {
  return countries.find(
    (country) => country.name.toLowerCase() === name.toLowerCase(),
  );
}

export function searchCountries(
  countries: Country[],
  query: string,
): Country[] {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return countries;

  return countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm) ||
      country.code.toLowerCase().includes(searchTerm),
  );
}
