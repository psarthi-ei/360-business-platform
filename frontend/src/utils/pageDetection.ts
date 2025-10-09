/**
 * Page Detection Utilities
 * Determines page types for routing and UI component logic
 */

/**
 * Helper function to determine if current path is a platform page (needs universal search)
 */
export function isPlatformPage(pathname: string): boolean {
  return pathname.startsWith('/platform');
}

/**
 * Helper function to determine if current path is a website marketing page
 */
export function isWebsitePage(pathname: string): boolean {
  return !isPlatformPage(pathname);
}