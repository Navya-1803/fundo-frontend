// keeps the notes whose title or text contains the search text, ignoring case
export const filterNotes = (notes, query) => {
  const text = (query || '').trim().toLowerCase();
  if (!text) return notes;
  return notes.filter(
    (note) => note.title.toLowerCase().includes(text) || (note.description || '').toLowerCase().includes(text),
  );
};
