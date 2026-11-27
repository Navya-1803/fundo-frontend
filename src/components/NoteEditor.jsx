import { useState } from 'react';
import { validateNote } from '../utils/validators.js';
import './NoteEditor.css';

// "Take a note..." box: collapsed until clicked, then title and text fields
function NoteEditor({ onCreate }) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    setNote({ title: '', description: '' });
    setError('');
    setExpanded(false);
  };

  const handleSave = async () => {
    // closing an empty editor is not an error, it just collapses
    if (!note.title.trim() && !note.description.trim()) {
      reset();
      return;
    }
    const errors = validateNote(note);
    if (errors.title || errors.description) {
      setError(errors.title || errors.description);
      return;
    }
    setSaving(true);
    try {
      await onCreate({ title: note.title.trim(), description: note.description.trim() });
      reset();
    } catch (err) {
      setError(err.message || 'Could not save the note');
    } finally {
      setSaving(false);
    }
  };

  if (!expanded) {
    return (
      <div className="note-editor collapsed">
        <button type="button" className="note-editor-placeholder" onClick={() => setExpanded(true)}>
          Take a note...
        </button>
      </div>
    );
  }

  return (
    <div className="note-editor">
      <input name="title" placeholder="Title" aria-label="Title" value={note.title} onChange={handleChange} maxLength={100} autoFocus />
      <textarea name="description" placeholder="Take a note..." aria-label="Note text" value={note.description} onChange={handleChange} rows={3} />
      {error && <p className="field-error" role="alert">{error}</p>}
      <div className="note-editor-actions">
        <button type="button" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Close'}
        </button>
      </div>
    </div>
  );
}

export default NoteEditor;
