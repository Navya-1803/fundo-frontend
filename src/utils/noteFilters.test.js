import { filterNotes } from './noteFilters.js';

const notes = [
  { id: 1, title: 'Shopping list', description: 'Milk' },
  { id: 2, title: 'Ideas', description: 'Build a NOTES app' },
  { id: 3, title: 'Empty', description: null },
];

describe('filterNotes', () => {
  it('returns every note for an empty query', () => {
    expect(filterNotes(notes, '  ')).toHaveLength(3);
  });

  it('matches title and description ignoring case', () => {
    expect(filterNotes(notes, 'shop').map((n) => n.id)).toEqual([1]);
    expect(filterNotes(notes, 'notes').map((n) => n.id)).toEqual([2]);
    expect(filterNotes(notes, 'zzz')).toEqual([]);
  });
});
