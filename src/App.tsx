import './App.scss'
import { useState, useRef } from 'react'
import NoteList from './components/NoteList/NoteList'
import AddNote from './components/AddNote/AddNote'
import NoteInterface from './components/Note/NoteInterface'
import EditModal from './components/EditModal/EditModal'
import TagPicker from './components/TagPicker/TagPicker'
import CategoryTree from './components/CategoryTree/CategoryTree'
import { Category } from './components/CategoryTree/CategoryTree'

function App() {
  const [notes, setNotes] = useState<NoteInterface[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteInterface | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([{id: crypto.randomUUID(), name: 'All', children: [
    { id: crypto.randomUUID(), name: 'Work', children: [{ id: crypto.randomUUID(), name: 'Zaza', children: [{ id: crypto.randomUUID(), name: 'Kek', children: [] }] }] },
    { id: crypto.randomUUID(), name: 'Personal', children: [] },
  ]}]);
  const newCategoryInputRef = useRef<HTMLInputElement>(null);

  const extractTags = (notes: NoteInterface[]) => {
    const uniqueTagsSet = new Set<string>(['#job', '#study']);

    notes.forEach(note => {
      note.tags.forEach(tag => {
        uniqueTagsSet.add(tag);
      });
    });

    // starting tags added 
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

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(curCategory => {
      if (curCategory?.id === category?.id) {
        return null;
      } else {
        return category;
      }
    })
  }

  const addCategory = (parent: Category | null, name: string): void => {
    if (!name) return;
    const newCategory: Category = { id: crypto.randomUUID(), name, children: [] };
  
    if (parent) {
      parent.children.push(newCategory);
      setCategories([...categories]);
    } else {
      const allCategoryIndex = categories.findIndex(category => category.name === 'All');
      categories[allCategoryIndex].children.push(newCategory);
      setCategories([...categories]);
    }
    if (newCategoryInputRef.current) {
      newCategoryInputRef.current.value = '';
    }
  };
  

  const editCategory = (category: Category, newName: string): void => {
    category.name = newName;  
    setCategories([...categories]);
  };

  const deleteCategory = (categoryToDelete: Category): void => {
    const deleteCategoryRecursive = (category: Category): Category | null => {
      const updatedChildren = category.children
        .map((child) => deleteCategoryRecursive(child))
        .filter((child) => child !== null) as Category[];
      if (category.id === categoryToDelete.id) {
        return null;
      }
      return { ...category, children: updatedChildren };
    };
  
    setCategories(categories.map(deleteCategoryRecursive).filter((category) => category !== null) as Category[]);

    if (categoryToDelete.id === selectedCategory?.id) setSelectedCategory(null);

  };

  const extractCategoryIds = (note: NoteInterface) => {
    return note.categories.map(category => category.value)
  }
    
  let filteredNotes = selectedTags.length > 0
    ? notes.filter(note => selectedTags.every(tag => note.tags.includes(tag)))
    : notes;


  filteredNotes = selectedCategory
  ? notes.filter(note => extractCategoryIds(note).includes(selectedCategory?.id))
  : filteredNotes;

  return (
    <>
      <div className="add-note-container">
        <AddNote categories={categories} selectedCategory={selectedCategory} onAddNote={addNoteToList}/>
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
          categories={categories}
        />
      )}
      <TagPicker tags={extractTags(notes)} selectedTags={selectedTags} onSelectTag={handleSelectTag}/>
      <CategoryTree categories={categories} selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} onAddCategory={addCategory} onEditCategory={editCategory} onDeleteCategory={deleteCategory}/>
      <input ref={newCategoryInputRef} type="text" name="new-category" placeholder={selectedCategory?.name ? `Add to ${selectedCategory.name}`: 'Choose category to add'} />
      <button type='button' onClick={() => addCategory(selectedCategory, newCategoryInputRef.current.value)}>Add</button>
    </>
  )
}

export default App
