import "./Note.scss";
import NoteInterface from "./NoteInterface";
import { Fragment } from "react/jsx-runtime";
import { MouseEvent } from "react";

interface NoteProps {
  note: NoteInterface;
  onDeleteNote: (note: NoteInterface) => void;
  onEditNote: (note: NoteInterface) => void;
}

function Note({ note, onDeleteNote, onEditNote }: NoteProps) {
  const text = note.text;
  const tag_regex = /#[^\s#]+/g;

  const highlighted_text = text.split("\n").map((line, index) => (
    <Fragment key={index}>
      {line.split(" ").map((word, i) => {
        if (word.match(tag_regex))
          return (
            <span style={{ textDecoration: "underline" }} key={i}>
              {word}{" "}
            </span>
          );
        return <Fragment key={i}>{word} </Fragment>;
      })}
      <br />
    </Fragment>
  ));

  const handleDeleteNote = (
    event: MouseEvent<HTMLElement>,
    note: NoteInterface
  ) => {
    event.stopPropagation();
    onDeleteNote(note);
  };

  const handleEditNote = (
    event: MouseEvent<HTMLElement>,
    note: NoteInterface
  ) => {
    event.stopPropagation();
    onEditNote(note);
  };

  return (
    <div
      style={{ backgroundColor: note.color }}
      className="note"
      onClick={() => onEditNote(note)}
    >
      <div className="note-text">
        <span className="note-title">{note.title}</span>
        <div className="note-content">{highlighted_text}</div>
      </div>
      <div className="note-footer">
        <div className="note-btns">
          <button
            type="button"
            onClick={(event) => handleEditNote(event, note)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#434343"
            >
              <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(event) => handleDeleteNote(event, note)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#434343"
            >
              <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Note;
