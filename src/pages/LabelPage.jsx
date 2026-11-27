import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import NoteList from '../components/NoteList.jsx';
import { useLayoutContext } from '../hooks/useLayoutContext.js';
import { useNotes } from '../hooks/useNotes.js';
import { getNotesByLabel } from '../services/labelService.js';
import { filterNotes } from '../utils/noteFilters.js';

// notes that carry the label selected in the sidebar
function LabelPage() {
  const { labelId } = useParams();
  const { searchQuery, labels } = useLayoutContext();
  // a new fetch function per label so the list reloads when the label changes
  const fetchNotes = useCallback(() => getNotesByLabel(labelId), [labelId]);
  const { notes, loading, error } = useNotes(fetchNotes);
  const label = labels.find((item) => String(item.id) === String(labelId));

  return (
    <section>
      <h2 className="page-title">{label ? label.name : 'Label'}</h2>
      {error && <p className="page-error" role="alert">{error}</p>}
      {loading ? (
        <p className="status-text">Loading notes...</p>
      ) : (
        <NoteList notes={filterNotes(notes, searchQuery)} emptyMessage={searchQuery ? 'No matching notes' : 'No notes with this label yet'} />
      )}
    </section>
  );
}

export default LabelPage;
