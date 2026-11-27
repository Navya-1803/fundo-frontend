import { useOutletContext } from 'react-router-dom';

// search text typed in the navbar, empty when the page is used outside the layout
export function useSearchQuery() {
  const context = useOutletContext();
  return context?.searchQuery || '';
}
