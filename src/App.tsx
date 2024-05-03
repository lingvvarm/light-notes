import { useState } from 'react'
import './App.scss'
import NoteList from './components/NoteList/NoteList'
import AddNote from './components/AddNote/AddNote'
import NoteInterface from './components/Note/NoteInterface'
import EditModal from './components/EditModal/EditModal'
import TagPicker from './components/TagPicker/TagPicker'

function App() {
  const [notes, setNotes] = useState<NoteInterface[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteInterface | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  

  const extractTags = (notes: NoteInterface[]) => {
    const uniqueTagsSet = new Set<string>();

    notes.forEach(note => {
      note.tags.forEach(tag => {
        uniqueTagsSet.add(tag);
      });
    });

    const uniqueTags = Array.from(uniqueTagsSet);
    return uniqueTags
  }

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
    console.log(notes);
  }

  const handleEditModalClose = () => {
    setSelectedNote(null);
  };

  const handleSelectTag = (tag: string) => {
    setSelectedTags(tags => {
      if (tags.includes(tag)) {
        return tags.filter(t => t !== tag);
      } else {
        return [...tags, tag];
      }
    })
  }

  const filteredNotes = selectedTags.length > 0
    ? notes.filter(note => selectedTags.every(tag => note.tags.includes(tag)))
    : notes;

  return (
    <>
      <div className="add-note-container">
        <AddNote onAddNote={addNoteToList}/>
      </div>
      <div className="app-container">
        <NoteList notes={filteredNotes} onDeleteNote={deleteNote} onEditNote={setSelectedNote}/>
      </div>
      {selectedNote && (
        <EditModal
          note={selectedNote}
          onCloseModal={handleEditModalClose}
          onSaveNote={editNote}
          onChangeNote={setSelectedNote}
        />
      )}
      <TagPicker tags={extractTags(notes)} selectedTags={selectedTags} onSelectTag={handleSelectTag}/>
    </>
  )
}

export default App
