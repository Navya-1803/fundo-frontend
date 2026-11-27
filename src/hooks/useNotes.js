import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../utils/errorMessage.js';

/**
 * Loads a list of notes with the given service function and keeps the
 * loading and error state. Every notes page (dashboard, archive, trash...)
 * uses this hook with its own fetch function.
 */
export function useNotes(fetchNotes) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchNotes();
      setNotes(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load notes'));
    } finally {
      setLoading(false);
    }
  }, [fetchNotes]);

  // load once when the page opens
  useEffect(() => {
    reload();
  }, [reload]);

  return { notes, setNotes, loading, error, reload };
}
