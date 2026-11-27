import { useState } from 'react';
import EditNoteModal from '../components/EditNoteModal.jsx';
import NoteLabelPicker from '../components/NoteLabelPicker.jsx';
import NoteEditor from '../components/NoteEditor.jsx';
import NoteList from '../components/NoteList.jsx';
import ReminderPicker from '../components/ReminderPicker.jsx';
import { useNotes } from '../hooks/useNotes.js';
import { useLayoutContext } from '../hooks/useLayoutContext.js';
import { archiveNote, createNote, getAllNotes, moveToTrash, pinNote, updateNote } from '../services/noteService.js';
import { addLabelToNote, removeLabelFromNote } from '../services/labelService.js';
import { setReminder } from '../services/reminderService.js';
import { getErrorMessage } from '../utils/errorMessage.js';
import { filterNotes } from '../utils/noteFilters.js';

// home screen: create notes and see the active ones, pinned notes first
function DashboardPage() {
  const { notes: allNotes, loading, error, reload } = useNotes(getAllNotes);
  const [actionError, setActionError] = useState('');
  // notes are filtered on the client with the text from the navbar search
  const { searchQuery, labels } = useLayoutContext();
  const notes = filterNotes(allNotes, searchQuery);
  // note currently open in the edit dialog
  const [editingNote, setEditingNote] = useState(null);
  // note currently open in the reminder dialog
  const [reminderNote, setReminderNote] = useState(null);
  // id of the note open in the label picker, the note itself is read from the fresh list
  const [labelNoteId, setLabelNoteId] = useState(null);

  const handleCreate = async (note) => {
    try {
      await createNote(note);
      await reload();
    } catch (err) {
      // the editor shows this message under the input fields
      throw new Error(getErrorMessage(err, 'Could not save the note'));
    }
  };

  const handleUpdate = async (noteId, note) => {
    try {
      await updateNote(noteId, note);
      await reload();
    } catch (err) {
      throw new Error(getErrorMessage(err, 'Could not save the note'));
    }
  };

  const handleSetReminder = async (noteId, reminderTime, message) => {
    try {
      await setReminder(noteId, reminderTime, message);
      await reload();
    } catch (err) {
      throw new Error(getErrorMessage(err, 'Could not set the reminder'));
    }
  };

  const handleToggleLabel = async (noteId, labelId, add) => {
    try {
      await (add ? addLabelToNote(noteId, labelId) : removeLabelFromNote(noteId, labelId));
      await reload();
    } catch (err) {
      throw new Error(getErrorMessage(err, 'Could not change the labels'));
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
      <button type="button" onClick={() => setReminderNote(note)}>Remind me</button>
      <button type="button" onClick={() => setLabelNoteId(note.id)}>Labels</button>
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
              <NoteList notes={pinned} renderActions={renderActions} onOpen={setEditingNote} />
              <h2 className="page-title">Others</h2>
            </>
          )}
          <NoteList notes={others} renderActions={renderActions} onOpen={setEditingNote} emptyMessage={searchQuery ? 'No matching notes' : pinned.length ? 'No other notes' : 'Notes you add appear here'} />
        </>
      )}
      {labelNoteId && allNotes.some((note) => note.id === labelNoteId) && (
        <NoteLabelPicker note={allNotes.find((note) => note.id === labelNoteId)} labels={labels} onToggle={handleToggleLabel} onClose={() => setLabelNoteId(null)} />
      )}
      {reminderNote && <ReminderPicker note={reminderNote} onSave={handleSetReminder} onClose={() => setReminderNote(null)} />}
      {editingNote && <EditNoteModal note={editingNote} onSave={handleUpdate} onClose={() => setEditingNote(null)} />}
    </section>
  );
}

export default DashboardPage;
