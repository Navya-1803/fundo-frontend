import { useCallback, useEffect, useState } from 'react';
import { getLabels } from '../services/labelService.js';
import { getErrorMessage } from '../utils/errorMessage.js';

// loads the labels of the logged in user, used by the app layout
export function useLabels() {
  const [labels, setLabels] = useState([]);
  const [error, setError] = useState('');

  const reloadLabels = useCallback(async () => {
    try {
      const response = await getLabels();
      setLabels(response.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load labels'));
    }
  }, []);

  useEffect(() => {
    reloadLabels();
  }, [reloadLabels]);

  return { labels, error, reloadLabels };
}
