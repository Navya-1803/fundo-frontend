import { useEffect, useState } from 'react';
import { createLabel, deleteLabel, renameLabel } from '../services/labelService.js';
import { getErrorMessage } from '../utils/errorMessage.js';
import './EditNoteModal.css';
import './LabelModal.css';

// "Edit labels" dialog: create, rename and delete the user's labels
function LabelModal({ labels, onChanged, onClose }) {
  const [newName, setNewName] = useState('');
  const [names, setNames] = useState({});
  const [error, setError] = useState('');

  // keep one editable name per label
  useEffect(() => {
    setNames(Object.fromEntries(labels.map((label) => [label.id, label.name])));
  }, [labels]);

  const run = async (action) => {
    setError('');
    try {
      await action();
      await onChanged();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update labels'));
    }
  };

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    run(async () => {
      await createLabel(name);
      setNewName('');
    });
  };

  const handleRename = (label) => {
    const name = (names[label.id] || '').trim();
    if (!name || name === label.name) return;
    run(() => renameLabel(label.id, name));
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal label-modal" role="dialog" aria-modal="true" aria-label="Edit labels" onClick={(e) => e.stopPropagation()}>
        <h3>Edit labels</h3>
        <div className="label-row">
          <input aria-label="New label name" placeholder="Create new label" value={newName} maxLength={50}
            onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreate()} />
          <button type="button" onClick={handleCreate}>Create</button>
        </div>
        {labels.map((label) => (
          <div className="label-row" key={label.id}>
            <input aria-label={`Label ${label.name}`} value={names[label.id] ?? label.name} maxLength={50}
              onChange={(e) => setNames((prev) => ({ ...prev, [label.id]: e.target.value }))} />
            <button type="button" onClick={() => handleRename(label)}>Rename</button>
            <button type="button" onClick={() => run(() => deleteLabel(label.id))} aria-label={`Delete ${label.name}`}>Delete</button>
          </div>
        ))}
        {error && <p className="field-error" role="alert">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="modal-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

export default LabelModal;
