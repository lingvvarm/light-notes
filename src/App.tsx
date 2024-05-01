import { useState } from 'react'
import './App.scss'
import NoteList from './components/NoteList/NoteList'
import AddNote from './components/AddNote/AddNote'
import NoteInterface from './components/Note/NoteInterface'
import EditModal from './components/EditModal/EditModal'

function App() {
  const [notes, setNotes] = useState<NoteInterface[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteInterface | null>(null);
  
  const addNoteToList = (note: NoteInterface) => {
    setNotes([...notes, note]);
  };

  const deleteNote = (note: NoteInterface) => {
    const newNotes = notes.filter((element) => element.id !== note.id);
    setNotes(newNotes);
  }

  const editNote = () => {
    if (selectedNote) {
      const updatedNotes = notes.map((note) =>
        note.id === selectedNote.id ? selectedNote : note
      );
      setNotes(updatedNotes);
    }
  }

  const handleEditModalClose = () => {
    setSelectedNote(null);
  };

  return (
    <>
      <div className="add-note-container">
        <AddNote onAddNote={addNoteToList}/>
      </div>
      <div className="app-container">
        <NoteList notes={notes} onDeleteNote={deleteNote} onEditNote={setSelectedNote}/>
      </div>
      {selectedNote && (
        <EditModal
          note={selectedNote}
          onCloseModal={handleEditModalClose}
          onSaveNote={editNote}
          onChangeNote={setSelectedNote}
        />
      )}
    </>
  )
}

export default App
