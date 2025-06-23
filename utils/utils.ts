export const normalizeValue = (
  value: unknown,
): string | number | null | undefined => {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    value === null ||
    typeof value === "undefined"
  ) {
    return value;
  }

  return "";
};
