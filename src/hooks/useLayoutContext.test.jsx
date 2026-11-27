import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import { useLayoutContext } from './useLayoutContext.js';

function Probe() {
  const { searchQuery, labels } = useLayoutContext();
  return <p>{`${searchQuery}|${labels.length}`}</p>;
}

describe('useLayoutContext', () => {
  it('reads the layout data', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<Outlet context={{ searchQuery: 'milk', labels: [{ id: 1, name: 'Work' }] }} />}>
            <Route path="/" element={<Probe />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('milk|1')).toBeInTheDocument();
  });

  it('has safe defaults without a layout', () => {
    render(<MemoryRouter><Probe /></MemoryRouter>);
    expect(screen.getByText('|0')).toBeInTheDocument();
  });
});
