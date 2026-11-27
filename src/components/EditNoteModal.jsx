import { useEffect, useState } from 'react';
import { validateNote } from '../utils/validators.js';
import './EditNoteModal.css';

// dialog used to change the title and text of an existing note
function EditNoteModal({ note, onSave, onClose }) {
  const [form, setForm] = useState({ title: note.title, description: note.description || '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Escape closes the dialog like most editors
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const errors = validateNote(form);
    if (errors.title || errors.description) {
      setError(errors.title || errors.description);
      return;
    }
    setSaving(true);
    try {
      await onSave(note.id, { title: form.title.trim(), description: form.description.trim() });
      onClose();
    } catch (err) {
      setError(err.message || 'Could not save the note');
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-label="Edit note" onClick={(e) => e.stopPropagation()}>
        <input name="title" aria-label="Edit title" value={form.title} onChange={handleChange} maxLength={100} />
        <textarea name="description" aria-label="Edit text" value={form.description} onChange={handleChange} rows={6} />
        {error && <p className="field-error" role="alert">{error}</p>}
        <div className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="button" className="modal-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditNoteModal;
