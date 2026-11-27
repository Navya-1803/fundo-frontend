import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import LabelPage from './LabelPage.jsx';
import { getNotesByLabel } from '../services/labelService.js';

vi.mock('../services/labelService.js', () => ({ getNotesByLabel: vi.fn() }));

const renderAt = (labelId) =>
  render(
    <MemoryRouter initialEntries={[`/labels/${labelId}`]}>
      <Routes>
        <Route element={<Outlet context={{ searchQuery: '', labels: [{ id: 3, name: 'Work' }] }} />}>
          <Route path="/labels/:labelId" element={<LabelPage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe('LabelPage', () => {
  afterEach(() => vi.clearAllMocks());

  it('shows the label name and its notes', async () => {
    getNotesByLabel.mockResolvedValue({ data: [{ id: 1, title: 'Report', labels: [{ id: 3, name: 'Work' }] }] });
    renderAt(3);
    expect(screen.getByRole('heading', { name: 'Work' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Report' })).toBeInTheDocument();
    expect(getNotesByLabel).toHaveBeenCalledWith('3');
  });

  it('shows the empty state', async () => {
    getNotesByLabel.mockResolvedValue({ data: [] });
    renderAt(3);
    expect(await screen.findByText('No notes with this label yet')).toBeInTheDocument();
  });

  it('shows the loading error', async () => {
    getNotesByLabel.mockImplementation(() => Promise.reject(Object.assign(new Error('x'), { response: { data: { message: 'Label not found with id: 99' } } })));
    renderAt(99);
    expect(await screen.findByRole('alert')).toHaveTextContent('Label not found with id: 99');
  });
});
