import { useOutletContext } from 'react-router-dom';

const EMPTY_CONTEXT = { searchQuery: '', labels: [], reloadLabels: () => {} };

// data the app layout shares with every page (search text and labels)
export function useLayoutContext() {
  const context = useOutletContext();
  return { ...EMPTY_CONTEXT, ...(context || {}) };
}
