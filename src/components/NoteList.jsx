import NoteCard from './NoteCard.jsx';
import './NoteList.css';

// grid of note cards, renderActions builds the buttons of each card
function NoteList({ notes, renderActions, onOpen, emptyMessage = 'No notes here yet' }) {
  if (notes.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>;
  }
  return (
    <div className="note-list">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onOpen={onOpen} actions={renderActions ? renderActions(note) : null} />
      ))}
    </div>
  );
}

export default NoteList;
