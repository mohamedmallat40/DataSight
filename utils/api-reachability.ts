/**
 * Direct API utility functions for email and website reachability checking
 * These provide a simpler interface for direct API calls without caching
 */

import { checkEmailAlive, checkWebsiteReachable } from "@/config/api";
import type {
  EmailReachabilityResponse,
  WebsiteReachabilityResponse,
} from "./reachability";

/**
 * Check if an email is alive using the API endpoint
 * Example: /is-email-alive?email=lokaa@gmail.com
 */
export async function isEmailAlive(email: string): Promise<boolean> {
  try {
    const response: EmailReachabilityResponse = await checkEmailAlive(email);
    return response.isAlive;
  } catch (error) {
    console.error("Email alive check failed:", error);
    throw error;
  }
}

/**
 * Check if a website is reachable using the API endpoint
 * Example: /is-website-reachable?url=https://perla-ssssit.com
 */
export async function isWebsiteReachable(url: string): Promise<boolean> {
  try {
    const response: WebsiteReachabilityResponse =
      await checkWebsiteReachable(url);
    return response.isReachable;
  } catch (error) {
    console.error("Website reachable check failed:", error);
    throw error;
  }
}

/**
 * Get detailed email information from the API
 */
export async function getEmailDetails(
  email: string,
): Promise<EmailReachabilityResponse> {
  try {
    return await checkEmailAlive(email);
  } catch (error) {
    console.error("Email details check failed:", error);
    throw error;
  }
}

/**
 * Get detailed website information from the API
 */
export async function getWebsiteDetails(
  url: string,
): Promise<WebsiteReachabilityResponse> {
  try {
    return await checkWebsiteReachable(url);
  } catch (error) {
    console.error("Website details check failed:", error);
    throw error;
  }
}

/**
 * Batch check multiple emails
 */
export async function checkMultipleEmails(
  emails: string[],
): Promise<{ email: string; isAlive: boolean }[]> {
  const results = await Promise.allSettled(
    emails.map(async (email) => {
      const isAlive = await isEmailAlive(email);
      return { email, isAlive };
    }),
  );

  return results
    .filter(
      (
        result,
      ): result is PromiseFulfilledResult<{
        email: string;
        isAlive: boolean;
      }> => result.status === "fulfilled",
    )
    .map((result) => result.value);
}

/**
 * Batch check multiple websites
 */
export async function checkMultipleWebsites(
  urls: string[],
): Promise<{ url: string; isReachable: boolean }[]> {
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const isReachable = await isWebsiteReachable(url);
      return { url, isReachable };
    }),
  );

  return results
    .filter(
      (
        result,
      ): result is PromiseFulfilledResult<{
        url: string;
        isReachable: boolean;
      }> => result.status === "fulfilled",
    )
    .map((result) => result.value);
}

/**
 * Example usage functions for demonstration
 */
export const exampleUsage = {
  // Test the example email from the user
  async testEmail() {
    try {
      const isAlive = await isEmailAlive("lokaa@gmail.com");
      console.log("Email lokaa@gmail.com is alive:", isAlive);
      return isAlive;
    } catch (error) {
      console.error("Test email failed:", error);
      return false;
    }
  },

  // Test the example website from the user
  async testWebsite() {
    try {
      const isReachable = await isWebsiteReachable("https://perla-ssssit.com");
      console.log(
        "Website https://perla-ssssit.com is reachable:",
        isReachable,
      );
      return isReachable;
    } catch (error) {
      console.error("Test website failed:", error);
      return false;
    }
  },
};
