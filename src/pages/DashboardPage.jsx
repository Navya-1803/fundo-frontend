import { useState } from 'react';
import NoteEditor from '../components/NoteEditor.jsx';
import NoteList from '../components/NoteList.jsx';
import { useNotes } from '../hooks/useNotes.js';
import { archiveNote, createNote, getAllNotes, moveToTrash, pinNote } from '../services/noteService.js';
import { getErrorMessage } from '../utils/errorMessage.js';

// home screen: create notes and see the active ones, pinned notes first
function DashboardPage() {
  const { notes, loading, error, reload } = useNotes(getAllNotes);
  const [actionError, setActionError] = useState('');

  const handleCreate = async (note) => {
    try {
      await createNote(note);
      await reload();
    } catch (err) {
      // the editor shows this message under the input fields
      throw new Error(getErrorMessage(err, 'Could not save the note'));
    }
  };

  // runs a note action on the backend and refreshes the list
  const runAction = async (action, noteId) => {
    setActionError('');
    try {
      await action(noteId);
      await reload();
    } catch (err) {
      setActionError(getErrorMessage(err, 'Action failed'));
    }
  };

  const renderActions = (note) => (
    <>
      <button type="button" onClick={() => runAction(pinNote, note.id)}>{note.pinned ? 'Unpin' : 'Pin'}</button>
      <button type="button" onClick={() => runAction(archiveNote, note.id)}>Archive</button>
      <button type="button" onClick={() => runAction(moveToTrash, note.id)}>Trash</button>
    </>
  );

  const pinned = notes.filter((note) => note.pinned);
  const others = notes.filter((note) => !note.pinned);
  const pageError = error || actionError;

  return (
    <section>
      <NoteEditor onCreate={handleCreate} />
      {pageError && <p className="page-error" role="alert">{pageError}</p>}
      {loading ? (
        <p className="status-text">Loading notes...</p>
      ) : (
        <>
          {pinned.length > 0 && (
            <>
              <h2 className="page-title">Pinned</h2>
              <NoteList notes={pinned} renderActions={renderActions} />
              <h2 className="page-title">Others</h2>
            </>
          )}
          <NoteList notes={others} renderActions={renderActions} emptyMessage={pinned.length ? 'No other notes' : 'Notes you add appear here'} />
        </>
      )}
    </section>
  );
}

export default DashboardPage;
