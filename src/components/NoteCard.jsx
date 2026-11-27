import { formatReminder } from '../utils/dateFormat.js';
import './NoteCard.css';

// one note in the grid, it only displays data and reports clicks to the parent
function NoteCard({ note, actions, onOpen }) {
  return (
    <article className={`note-card ${note.pinned ? 'pinned' : ''}`} aria-label={note.title}>
      {note.pinned && <span className="note-badge">Pinned</span>}
      {/* clicking the text opens the note for editing when the page allows it */}
      <div
        className={`note-body ${onOpen ? 'clickable' : ''}`}
        onClick={onOpen ? () => onOpen(note) : undefined}
        onKeyDown={onOpen ? (e) => e.key === 'Enter' && onOpen(note) : undefined}
        role={onOpen ? 'button' : undefined}
        tabIndex={onOpen ? 0 : undefined}
        aria-label={onOpen ? `Edit ${note.title}` : undefined}
      >
        <h3 className="note-title">{note.title}</h3>
        {note.description && <p className="note-description">{note.description}</p>}
      </div>
      {note.reminderTime && <span className="note-chip">&#9200; {formatReminder(note.reminderTime)}</span>}
      {actions && <div className="note-actions">{actions}</div>}
    </article>
  );
}

export default NoteCard;
