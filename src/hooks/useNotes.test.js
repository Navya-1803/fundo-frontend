import { renderHook, waitFor } from '@testing-library/react';
import { useNotes } from './useNotes.js';

describe('useNotes', () => {
  it('loads notes on mount', async () => {
    const fetchNotes = vi.fn(() => Promise.resolve({ data: [{ id: 1, title: 'A' }] }));
    const { result } = renderHook(() => useNotes(fetchNotes));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.notes).toEqual([{ id: 1, title: 'A' }]);
    expect(result.current.error).toBe('');
  });

  it('keeps the error message when loading fails', async () => {
    const fetchNotes = vi.fn(() => Promise.reject(Object.assign(new Error('x'), { response: { data: { message: 'Invalid or expired token' } } })));
    const { result } = renderHook(() => useNotes(fetchNotes));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Invalid or expired token');
    expect(result.current.notes).toEqual([]);
  });
});
