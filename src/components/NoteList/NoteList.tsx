import "./NoteList.scss";
import Note from "../Note/Note";
import NoteInterface from "../Note/NoteInterface";

interface NoteListProps {
  notes: NoteInterface[];
  onDeleteNote: (note: NoteInterface) => void;
  onEditNote: (note: NoteInterface) => void;
}

function NoteList({ notes, onDeleteNote, onEditNote }: NoteListProps) {
  return (
    <div className="note-list">
      {notes.map((note) => {
        return (
          <Note
            key={note.id}
            note={note}
            onDeleteNote={onDeleteNote}
            onEditNote={onEditNote}
          />
        );
      })}
    </div>
  );
}

export default NoteList;
