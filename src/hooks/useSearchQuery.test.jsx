import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import { useSearchQuery } from './useSearchQuery.js';

function Probe() {
  return <p>[{useSearchQuery()}]</p>;
}

describe('useSearchQuery', () => {
  it('reads the query from the layout', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<Outlet context={{ searchQuery: 'milk' }} />}>
            <Route path="/" element={<Probe />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('[milk]')).toBeInTheDocument();
  });

  it('is empty without a layout', () => {
    render(<MemoryRouter><Probe /></MemoryRouter>);
    expect(screen.getByText('[]')).toBeInTheDocument();
  });
});
