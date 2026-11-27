import { useState } from 'react';
import NoteList from '../components/NoteList.jsx';
import { useNotes } from '../hooks/useNotes.js';
import { useSearchQuery } from '../hooks/useSearchQuery.js';
import { deleteNoteForever, getTrashedNotes, moveToTrash } from '../services/noteService.js';
import { getErrorMessage } from '../utils/errorMessage.js';
import { filterNotes } from '../utils/noteFilters.js';

// notes in trash can be restored or deleted forever
function TrashPage() {
  const { notes: allNotes, loading, error, reload } = useNotes(getTrashedNotes);
  const [actionError, setActionError] = useState('');
  // notes are filtered on the client with the text from the navbar search
  const searchQuery = useSearchQuery();
  const notes = filterNotes(allNotes, searchQuery);

  const runAction = async (action, noteId) => {
    setActionError('');
    try {
      await action(noteId);
      await reload();
    } catch (err) {
      setActionError(getErrorMessage(err, 'Action failed'));
    }
  };

  const handleDelete = (note) => {
    // a permanent delete cannot be undone, so the user has to confirm
    if (window.confirm(`Delete "${note.title}" forever?`)) {
      runAction(deleteNoteForever, note.id);
    }
  };

  const pageError = error || actionError;

  return (
    <section>
      <h2 className="page-title">Trash</h2>
      {pageError && <p className="page-error" role="alert">{pageError}</p>}
      {loading ? (
        <p className="status-text">Loading notes...</p>
      ) : (
        <NoteList
          notes={notes}
          emptyMessage={searchQuery ? 'No matching notes' : "No notes in trash"}
          renderActions={(note) => (
            <>
              {/* trash is a toggle, calling it again restores the note */}
              <button type="button" onClick={() => runAction(moveToTrash, note.id)}>Restore</button>
              <button type="button" onClick={() => handleDelete(note)}>Delete forever</button>
            </>
          )}
        />
      )}
    </section>
  );
}

export default TrashPage;
