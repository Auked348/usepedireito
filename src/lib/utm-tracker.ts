/**
 * UTM Tracker - Capture and preserve UTM parameters across the user session.
 * 
 * Features:
 * 1. Automatically detects UTM parameters in the URL on first access.
 * 2. Persists parameters in localStorage to maintain attribution during navigation.
 * 3. Appends parameters to any generated destination URLs.
 * 4. Works in modern browsers (Client-side).
 */

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'ttclid', 'click_id', 'utm_id', 'utm_placement', 'utm_type', 'ad_id', 'adset_id', 'campaign_id'];
const STORAGE_KEY = 'pd_utm_data_v2';

/**
 * Captures UTMs from current URL and stores them in localStorage.
 * Should be called on application root or landing pages.
 */
export function captureUtms() {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const utmData: Record<string, string> = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  let hasNew = false;

  UTM_PARAMS.forEach(param => {
    const value = urlParams.get(param);
    if (value) {
      utmData[param] = value;
      hasNew = true;
    }
  });

  if (hasNew) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(utmData));
  }
}

/**
 * Retrieves stored UTM data.
 * @returns Object with captured UTM parameters.
 */
export function getStoredUtms(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
}

/**
 * Appends stored UTM parameters to a given URL.
 * @param baseUrl The destination URL to be modified.
 * @returns The final URL with UTM parameters attached.
 */
export function buildUrlWithUtms(baseUrl: string): string {
  const utms = getStoredUtms();
  if (Object.keys(utms).length === 0) return baseUrl;

  const url = new URL(baseUrl, typeof window !== 'undefined' ? window.location.origin : undefined);
  Object.entries(utms).forEach(([key, value]) => {
    // Only append if not already present in baseUrl
    if (!url.searchParams.has(key)) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

/**
 * Generates a raw query string for tracking (e.g., for API bodies).
 * @returns Query string like "utm_source=google&utm_medium=cpc..."
 */
export function getUtmQueryString(): string {
  const utms = getStoredUtms();
  return new URLSearchParams(utms).toString();
}
