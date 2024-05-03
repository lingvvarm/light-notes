import './Note.scss'
import NoteInterface from './NoteInterface'
import { Fragment } from 'react/jsx-runtime';
interface NoteProps {
    note: NoteInterface;
    onDeleteNote: (note: NoteInterface) => void;
    onEditNote: (note: NoteInterface) => void;
}

function Note({ note, onDeleteNote, onEditNote }: NoteProps) {
    const text = note.text
    const tag_regex = new RegExp("#[^s#]+");

    const highlighted_text = text.split(" ").map((word, index) => {
        if (word.match(tag_regex))
          return (
            <span style={{ color: "blue" }} key={index}>
              {word}{" "}
            </span>
          );
        return <Fragment key={index}>{word} </Fragment>;
      });

    return (
        <div style={{ backgroundColor: note.color }} className="note">
            <span>{note.title}</span>
            <div className="note-footer">
                <div>{highlighted_text}</div>
                <div className="note-btns">
                    <button type="button" onClick={() => onEditNote(note)}>Edit</button>
                    <button type="button" onClick={() => onDeleteNote(note)}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default Note;