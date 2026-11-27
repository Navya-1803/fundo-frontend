import { useState } from 'react';
import './EditNoteModal.css';
import './LabelModal.css';

// dialog with one checkbox per label to label or unlabel a note
function NoteLabelPicker({ note, labels, onToggle, onClose }) {
  const [error, setError] = useState('');
  // local copy so the checkbox changes at once, before the backend answers
  const [selected, setSelected] = useState(() => new Set((note.labels || []).map((label) => label.id)));

  const setChecked = (labelId, checked) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(labelId);
      else next.delete(labelId);
      return next;
    });

  const handleToggle = async (label) => {
    const add = !selected.has(label.id);
    setError('');
    setChecked(label.id, add);
    try {
      await onToggle(note.id, label.id, add);
    } catch (err) {
      // undo the change when the backend refuses it
      setChecked(label.id, !add);
      setError(err.message || 'Could not change the labels');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal label-modal" role="dialog" aria-modal="true" aria-label="Label note" onClick={(e) => e.stopPropagation()}>
        <h3>Label note</h3>
        {labels.length === 0 && <p>No labels yet, create one with &quot;Edit labels&quot; in the menu.</p>}
        {labels.map((label) => (
          <label key={label.id} className="label-row">
            <input type="checkbox" checked={selected.has(label.id)} onChange={() => handleToggle(label)} />
            {label.name}
          </label>
        ))}
        {error && <p className="field-error" role="alert">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="modal-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

export default NoteLabelPicker;
