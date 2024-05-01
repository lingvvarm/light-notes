import './Note.scss'
import NoteInterface from './NoteInterface'

interface NoteProps {
    note: NoteInterface;
    onDeleteNote: (note: NoteInterface) => void;
    onEditNote: (note: NoteInterface) => void;
}

function Note({ note, onDeleteNote, onEditNote }: NoteProps) {
    return (
        <div className="note">
            <span>{note.title}</span>
            <div className="note-footer">
                <small>{note.text}</small>
                <div className="note-btns">
                    <button type="button" onClick={() => onEditNote(note)}>Edit</button>
                    <button type="button" onClick={() => onDeleteNote(note)}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default Note;