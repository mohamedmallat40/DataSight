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
    // Enhanced email validation simulation
    setTimeout(
      () => {
        if (!isValidEmail(email)) {
          resolve(setCachedResult(key, "unreachable"));
          return;
        }

        const domain = email.split("@")[1]?.toLowerCase();
        let status: ReachabilityStatus;

        // Known good domains
        if (
          domain &&
          (domain.includes("gmail.com") ||
            domain.includes("outlook.com") ||
            domain.includes("hotmail.com") ||
            domain.includes("yahoo.com") ||
            domain.includes("icloud.com") ||
            domain.includes("protonmail.com"))
        ) {
          status = "reachable";
        }
        // Suspicious or temporary email domains
        else if (
          domain &&
          (domain.includes("tempmail") ||
            domain.includes("10minutemail") ||
            domain.includes("guerrillamail") ||
            domain.includes("mailinator"))
        ) {
          status = "unreachable";
        }
        // Corporate domains (likely valid)
        else if (domain && domain.match(/\.(com|org|net|edu|gov)$/)) {
          status = "reachable";
        }
        // Unknown or suspicious TLDs
        else {
          status = "unknown";
        }

        resolve(setCachedResult(key, status));
      },
      Math.random() * 200 + 50,
    ); // Random delay between 50-250ms
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

    // Enhanced simulation with better domain detection
    // In a real implementation, you'd use a backend service to check this
    setTimeout(
      () => {
        const url = website.toLowerCase();
        let status: ReachabilityStatus;

        // Check for obviously invalid URLs
        if (
          url.includes("localhost") ||
          url.includes("127.0.0.1") ||
          url.includes("example.com") ||
          url.includes("test.") ||
          url.includes("placeholder") ||
          url.includes("dummy")
        ) {
          status = "unreachable";
        }
        // Check for known reliable domains
        else if (
          url.includes("google.com") ||
          url.includes("github.com") ||
          url.includes("microsoft.com") ||
          url.includes("apple.com") ||
          url.includes("amazon.com") ||
          url.includes("facebook.com") ||
          url.includes("linkedin.com") ||
          url.includes("twitter.com")
        ) {
          status = "reachable";
        }
        // Check for common TLDs that are likely to be real
        else if (url.match(/\.(com|org|net|edu|gov|io|co|ai|tech|dev)($|\/)/)) {
          status = "reachable";
        }
        // Less common TLDs or suspicious patterns
        else if (url.match(/\.(xyz|tk|ml|ga|cf|info|biz)($|\/)/)) {
          status = "unknown";
        }
        // Invalid or malformed URLs
        else {
          status = "unreachable";
        }

        resolve(setCachedResult(key, status));
      },
      Math.random() * 300 + 100,
    ); // Random delay between 100-400ms for more realistic feel
  });
}

/**
 * Get the color scheme for reachability status
 */
export function getReachabilityColor(status: ReachabilityStatus): {
  color: "success" | "danger" | "warning" | "default";
  text: string;
  icon: string;
} {
  switch (status) {
    case "reachable":
      return { color: "success", text: "", icon: "solar:check-circle-bold" };
    case "unreachable":
      return { color: "danger", text: "Down", icon: "solar:close-circle-bold" };
    case "checking":
      return {
        color: "warning",
        text: "Checking",
        icon: "solar:refresh-circle-bold",
      };
    case "unknown":
    default:
      return {
        color: "default",
        text: "Unknown",
        icon: "solar:question-circle-bold",
      };
  }
}
