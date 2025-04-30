/**
 * Checks if a given path matches a route pattern
 * @param currentPath - The current path to check (e.g., /messages/123)
 * @param routePattern - The route pattern to match against (e.g., /messages/[id])
 * @returns boolean indicating if the current path matches the route pattern
 */
export function isRouteActive(
  currentPath: string,
  routePattern: string
): boolean {
  // If it's an exact match
  if (currentPath === routePattern) return true;

  // If the route pattern ends with a dynamic segment (e.g., /messages/[id])
  if (routePattern.includes("[") && routePattern.includes("]")) {
    const basePath = routePattern.split("/[")[0];
    return currentPath.startsWith(basePath);
  }

  // If the route pattern is a parent route (e.g., /messages)
  if (currentPath.startsWith(routePattern + "/")) {
    return true;
  }

  return false;
}
