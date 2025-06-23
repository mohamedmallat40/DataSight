// Reachability status types
export type ReachabilityStatus =
  | "reachable"
  | "unreachable"
  | "checking"
  | "unknown";

export interface ReachabilityResult {
  status: ReachabilityStatus;
  checkedAt: Date;
}

// Cache for storing reachability results
const reachabilityCache = new Map<string, ReachabilityResult>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Simple email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Check if an email address is valid format
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Check if a URL is valid format
 */
export function isValidUrl(url: string): boolean {
  try {
    // Add protocol if missing
    const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`;
    new URL(urlWithProtocol);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get cached reachability result if still valid
 */
function getCachedResult(key: string): ReachabilityResult | null {
  const cached = reachabilityCache.get(key);
  if (cached && Date.now() - cached.checkedAt.getTime() < CACHE_DURATION) {
    return cached;
  }
  return null;
}

/**
 * Set reachability result in cache
 */
function setCachedResult(
  key: string,
  status: ReachabilityStatus,
): ReachabilityResult {
  const result: ReachabilityResult = {
    status,
    checkedAt: new Date(),
  };
  reachabilityCache.set(key, result);
  return result;
}

/**
 * Check email reachability (simplified validation-based approach)
 * In a real implementation, you might use an email validation service
 */
export function checkEmailReachability(
  email: string,
): Promise<ReachabilityResult> {
  const key = `email:${email}`;

  // Check cache first
  const cached = getCachedResult(key);
  if (cached) {
    return Promise.resolve(cached);
  }

  return new Promise((resolve) => {
    // Simulate async check with basic validation
    setTimeout(() => {
      const isValid = isValidEmail(email);
      const status: ReachabilityStatus = isValid ? "reachable" : "unreachable";
      resolve(setCachedResult(key, status));
    }, 100);
  });
}

/**
 * Check website reachability using a simple approach
 * Note: Due to CORS restrictions, this is a simplified check
 */
export function checkWebsiteReachability(
  website: string,
): Promise<ReachabilityResult> {
  const key = `website:${website}`;

  // Check cache first
  const cached = getCachedResult(key);
  if (cached) {
    return Promise.resolve(cached);
  }

  return new Promise((resolve) => {
    // Basic URL validation
    if (!isValidUrl(website)) {
      resolve(setCachedResult(key, "unreachable"));
      return;
    }

    // For demo purposes, we'll simulate reachability based on common patterns
    // In a real implementation, you'd use a backend service to check this
    setTimeout(() => {
      const url = website.toLowerCase();
      let status: ReachabilityStatus;

      if (url.includes("localhost") || url.includes("127.0.0.1")) {
        status = "unreachable";
      } else if (
        url.includes("google.com") ||
        url.includes("github.com") ||
        url.includes(".com")
      ) {
        status = "reachable";
      } else {
        status = "unknown";
      }

      resolve(setCachedResult(key, status));
    }, 200);
  });
}

/**
 * Get the color scheme for reachability status
 */
export function getReachabilityColor(status: ReachabilityStatus): {
  color: "success" | "danger" | "warning" | "default";
  text: string;
} {
  switch (status) {
    case "reachable":
      return { color: "success", text: "Active" };
    case "unreachable":
      return { color: "danger", text: "Inactive" };
    case "checking":
      return { color: "warning", text: "Checking..." };
    case "unknown":
    default:
      return { color: "default", text: "Unknown" };
  }
}
