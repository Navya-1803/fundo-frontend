import { useLayoutContext } from './useLayoutContext.js';

// search text typed in the navbar, empty when the page is used outside the layout
export function useSearchQuery() {
  return useLayoutContext().searchQuery;
}
