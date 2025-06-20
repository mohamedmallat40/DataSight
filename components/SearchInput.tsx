import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@heroui/input";
import { SearchIcon } from "@heroui/shared-icons";
import { useRouter } from "next/router";

interface SearchInputProps {
  onSearchChange: (value: string) => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  debounceMs?: number;
}

/**
 * Enhanced search input that syncs with URL query parameters
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  onSearchChange,
  placeholder = "Search contacts...",
  size = "sm",
  className = "min-w-[200px]",
  debounceMs = 300,
}) => {
  const router = useRouter();
  const [localValue, setLocalValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>("");

  // Initialize search value from URL query parameter
  useEffect(() => {
    const searchParam = router.query.search as string;
    if (searchParam) {
      setLocalValue(searchParam);
      setDebouncedValue(searchParam);
      onSearchChange(searchParam);
    }
  }, [router.query.search, onSearchChange]);

  // Debounce the search value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs]);

  // Update URL and trigger search when debounced value changes
  useEffect(() => {
    if (debouncedValue !== (router.query.search || "")) {
      updateUrlWithSearch(debouncedValue);
      onSearchChange(debouncedValue);
    }
  }, [debouncedValue, router.query.search, onSearchChange]);

  const updateUrlWithSearch = useCallback(
    (searchValue: string) => {
      const query = { ...router.query };

      if (searchValue.trim()) {
        query.search = searchValue;
      } else {
        delete query.search;
      }

      // Update URL without causing a page reload
      router.replace(
        {
          pathname: router.pathname,
          query,
        },
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  const handleValueChange = useCallback((value: string) => {
    setLocalValue(value);
  }, []);

  const handleClear = useCallback(() => {
    setLocalValue("");
    setDebouncedValue("");
    updateUrlWithSearch("");
    onSearchChange("");
  }, [updateUrlWithSearch, onSearchChange]);

  return (
    <Input
      className={className}
      endContent={<SearchIcon className="text-default-400" width={16} />}
      placeholder={placeholder}
      size={size}
      value={localValue}
      onValueChange={handleValueChange}
      onClear={handleClear}
      isClearable={!!localValue}
    />
  );
};

export default SearchInput;
