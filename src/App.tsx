import { useState } from 'react'
import './App.scss'
import NoteList from './components/NoteList/NoteList'
import AddNote from './components/AddNote/AddNote'
import NoteInterface from './components/Note/NoteInterface'

function App() {
  const [notes, setNotes] = useState<NoteInterface[]>([]);
  
  const addNoteToList = (note: NoteInterface) => {
    setNotes([...notes, note]);
  };

  const deleteNote = (note: NoteInterface) => {
    const newNotes = notes.filter((element) => element.id !== note.id);
    setNotes(newNotes);
  }

  return (
    <>
      <div className="add-note-container">
        <AddNote onAddNote={addNoteToList}/>
      </div>
      <div className="app-container">
        <NoteList notes={notes} onDeleteNote={deleteNote}/>
      </div>
    </>
  )
}

export default App
