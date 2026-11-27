import { useState } from 'react';
import NoteList from '../components/NoteList.jsx';
import { useNotes } from '../hooks/useNotes.js';
import { useSearchQuery } from '../hooks/useSearchQuery.js';
import { getReminders, removeReminder } from '../services/reminderService.js';
import { getErrorMessage } from '../utils/errorMessage.js';
import { isPastReminder } from '../utils/dateFormat.js';
import { filterNotes } from '../utils/noteFilters.js';

// notes with a reminder, the earliest reminder first
function ReminderPage() {
  const { notes: allNotes, loading, error, reload } = useNotes(getReminders);
  const [actionError, setActionError] = useState('');
  const searchQuery = useSearchQuery();
  const notes = filterNotes(allNotes, searchQuery);
  const upcoming = notes.filter((note) => !isPastReminder(note.reminderTime));
  const past = notes.filter((note) => isPastReminder(note.reminderTime));

  const handleRemove = async (noteId) => {
    setActionError('');
    try {
      await removeReminder(noteId);
      await reload();
    } catch (err) {
      setActionError(getErrorMessage(err, 'Could not remove the reminder'));
    }
  };

  const renderActions = (note) => (
    <button type="button" onClick={() => handleRemove(note.id)}>Remove reminder</button>
  );
  const pageError = error || actionError;

  return (
    <section>
      {pageError && <p className="page-error" role="alert">{pageError}</p>}
      {loading ? (
        <p className="status-text">Loading reminders...</p>
      ) : (
        <>
          <h2 className="page-title">Upcoming</h2>
          <NoteList notes={upcoming} renderActions={renderActions} emptyMessage={searchQuery ? 'No matching notes' : 'Notes with upcoming reminders appear here'} />
          {past.length > 0 && (
            <>
              <h2 className="page-title">Past</h2>
              <NoteList notes={past} renderActions={renderActions} />
            </>
          )}
        </>
      )}
    </section>
  );
}

export default ReminderPage;
