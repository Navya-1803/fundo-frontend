import { useState } from 'react';
import { isPastReminder, toLocalInputValue } from '../utils/dateFormat.js';
import './EditNoteModal.css';

// dialog with a date-time input to schedule a reminder on a note
function ReminderPicker({ note, onSave, onClose }) {
  // default suggestion: one hour from now
  const [time, setTime] = useState(() => toLocalInputValue(new Date(Date.now() + 60 * 60 * 1000)));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!time) {
      setError('Choose a date and time');
      return;
    }
    if (isPastReminder(time)) {
      setError('Reminder time must be in the future');
      return;
    }
    setSaving(true);
    try {
      // seconds are added because the backend expects a full LocalDateTime
      await onSave(note.id, `${time}:00`, message.trim() || undefined);
      onClose();
    } catch (err) {
      setError(err.message || 'Could not set the reminder');
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-label="Set reminder" onClick={(e) => e.stopPropagation()}>
        <h3>Remind me about &quot;{note.title}&quot;</h3>
        <label htmlFor="reminder-time">Date and time</label>
        <input id="reminder-time" type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} />
        <label htmlFor="reminder-message">Message (optional)</label>
        <input id="reminder-message" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={255} />
        {/* the backend emails the reminder to the account address at this time */}
        <p className="reminder-hint">You will get an email with this reminder at the chosen time.</p>
        {error && <p className="field-error" role="alert">{error}</p>}
        <div className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="button" className="modal-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save reminder'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReminderPicker;
