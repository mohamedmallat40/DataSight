import React from "react";

interface HighlightedTextProps {
  text: string;
  searchTerm: string;
  className?: string;
  highlightClassName?: string;
}

/**
 * Component to highlight search terms in text
 */
export const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  searchTerm,
  className = "",
  highlightClassName = "bg-yellow-200 text-yellow-900 px-1 rounded-sm font-medium",
}) => {
  if (!searchTerm.trim()) {
    return <span className={className}>{text}</span>;
  }

  // Escape special regex characters in search term
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedSearchTerm})`, "gi");
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className={highlightClassName}>
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </span>
  );
};

/**
 * Utility function to check if text contains search term
 */
export const containsSearchTerm = (
  text: string,
  searchTerm: string,
): boolean => {
  if (!searchTerm.trim()) return false;
  return text.toLowerCase().includes(searchTerm.toLowerCase());
};

/**
 * Utility function to highlight search terms in email arrays
 */
export const highlightInArray = (
  items: string[],
  searchTerm: string,
  renderItem: (
    item: string,
    index: number,
    highlighted: boolean,
  ) => React.ReactNode,
): React.ReactNode[] => {
  return items.map((item, index) => {
    const highlighted = containsSearchTerm(item, searchTerm);
    return renderItem(item, index, highlighted);
  });
};

/**
 * Custom hook for URL-based search management
 */
export const useSearchFromUrl = () => {
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  // Get search term from URL on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get("search") || "";
      setSearchTerm(searchParam);
    }
  }, []);

  // Update URL when search term changes
  const updateSearchInUrl = React.useCallback((newSearchTerm: string) => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);

      if (newSearchTerm.trim()) {
        url.searchParams.set("search", newSearchTerm);
      } else {
        url.searchParams.delete("search");
      }

      // Use pushState to update URL without page reload
      window.history.pushState({}, "", url.toString());
      setSearchTerm(newSearchTerm);
    }
  }, []);

  return {
    searchTerm,
    updateSearchInUrl,
    setSearchTerm,
  };
};
