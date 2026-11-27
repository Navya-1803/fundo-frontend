import NoteEditor from '../components/NoteEditor.jsx';
import NoteList from '../components/NoteList.jsx';
import { useNotes } from '../hooks/useNotes.js';
import { createNote, getAllNotes } from '../services/noteService.js';
import { getErrorMessage } from '../utils/errorMessage.js';

// home screen: create notes and see the active ones, pinned notes first
function DashboardPage() {
  const { notes, loading, error, reload } = useNotes(getAllNotes);

  const handleCreate = async (note) => {
    try {
      await createNote(note);
      await reload();
    } catch (err) {
      // the editor shows this message under the input fields
      throw new Error(getErrorMessage(err, 'Could not save the note'));
    }
  };

  const pinned = notes.filter((note) => note.pinned);
  const others = notes.filter((note) => !note.pinned);

  return (
    <section>
      <NoteEditor onCreate={handleCreate} />
      {error && <p className="page-error" role="alert">{error}</p>}
      {loading ? (
        <p className="status-text">Loading notes...</p>
      ) : (
        <>
          {pinned.length > 0 && (
            <>
              <h2 className="page-title">Pinned</h2>
              <NoteList notes={pinned} />
              <h2 className="page-title">Others</h2>
            </>
          )}
          <NoteList notes={others} emptyMessage={pinned.length ? 'No other notes' : 'Notes you add appear here'} />
        </>
      )}
    </section>
  );
}

export default DashboardPage;
