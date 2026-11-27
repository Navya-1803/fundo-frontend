import { useState } from 'react';
import NoteList from '../components/NoteList.jsx';
import { useNotes } from '../hooks/useNotes.js';
import { archiveNote, getArchivedNotes, moveToTrash } from '../services/noteService.js';
import { getErrorMessage } from '../utils/errorMessage.js';

// archived notes, they can be moved back to the dashboard or to trash
function ArchivePage() {
  const { notes, loading, error, reload } = useNotes(getArchivedNotes);
  const [actionError, setActionError] = useState('');

  const runAction = async (action, noteId) => {
    setActionError('');
    try {
      await action(noteId);
      await reload();
    } catch (err) {
      setActionError(getErrorMessage(err, 'Action failed'));
    }
  };

  const pageError = error || actionError;

  return (
    <section>
      <h2 className="page-title">Archive</h2>
      {pageError && <p className="page-error" role="alert">{pageError}</p>}
      {loading ? (
        <p className="status-text">Loading notes...</p>
      ) : (
        <NoteList
          notes={notes}
          emptyMessage="Your archived notes appear here"
          renderActions={(note) => (
            <>
              {/* archive is a toggle, calling it again restores the note */}
              <button type="button" onClick={() => runAction(archiveNote, note.id)}>Unarchive</button>
              <button type="button" onClick={() => runAction(moveToTrash, note.id)}>Trash</button>
            </>
          )}
        />
      )}
    </section>
  );
}

export default ArchivePage;
