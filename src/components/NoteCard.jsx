import './NoteCard.css';

// one note in the grid, it only displays data and reports clicks to the parent
function NoteCard({ note, actions }) {
  return (
    <article className={`note-card ${note.pinned ? 'pinned' : ''}`} aria-label={note.title}>
      {note.pinned && <span className="note-badge">Pinned</span>}
      <h3 className="note-title">{note.title}</h3>
      {note.description && <p className="note-description">{note.description}</p>}
      {actions && <div className="note-actions">{actions}</div>}
    </article>
  );
}

export default NoteCard;
