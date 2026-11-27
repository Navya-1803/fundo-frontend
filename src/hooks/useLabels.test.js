import { renderHook, waitFor } from '@testing-library/react';
import { useLabels } from './useLabels.js';
import { getLabels } from '../services/labelService.js';

vi.mock('../services/labelService.js', () => ({ getLabels: vi.fn() }));

describe('useLabels', () => {
  afterEach(() => vi.clearAllMocks());

  it('loads the labels', async () => {
    getLabels.mockResolvedValue({ data: [{ id: 1, name: 'Work' }] });
    const { result } = renderHook(() => useLabels());
    await waitFor(() => expect(result.current.labels).toEqual([{ id: 1, name: 'Work' }]));
  });

  it('keeps an error message', async () => {
    getLabels.mockImplementation(() => Promise.reject(Object.assign(new Error('x'), { request: {} })));
    const { result } = renderHook(() => useLabels());
    await waitFor(() => expect(result.current.error).toContain('Cannot reach the server'));
  });
});
