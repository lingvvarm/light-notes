import "./App.scss";
import { useState, useRef, useEffect } from "react";
import NoteList from "./components/NoteList/NoteList";
import AddNote from "./components/AddNote/AddNote";
import NoteInterface from "./components/Note/NoteInterface";
import EditModal from "./components/EditModal/EditModal";
import TagPicker from "./components/TagPicker/TagPicker";
import CategoryTree from "./components/CategoryTree/CategoryTree";
import { Category } from "./components/CategoryTree/CategoryTree";
import { TagCount } from "./components/TagPicker/TagPicker";

function App() {
  // @ts-expect-error empty localstorage handled
  const storedNotes = JSON.parse(localStorage.getItem("notes"));
  const [notes, setNotes] = useState<NoteInterface[]>(storedNotes || []);
  const [selectedNote, setSelectedNote] = useState<NoteInterface | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const defaultCategories: Category[] = [
    {
      value: crypto.randomUUID(),
      label: "All",
      children: [
        { value: crypto.randomUUID(), label: "Work", children: [] },
        { value: crypto.randomUUID(), label: "Personal", children: [] },
      ],
    },
  ];
  // @ts-expect-error empty localstorage handled
  const storedCategories = JSON.parse(localStorage.getItem("categories")) || [];
  const [categories, setCategories] = useState<Category[]>(
    storedCategories.length > 0 ? storedCategories : defaultCategories
  );
  const allCategoryId = categories[0].value;
  const newCategoryInputRef = useRef<HTMLInputElement>(null);
  const errorTextRef = useRef(null);

  const extractTags = (notes: NoteInterface[]): TagCount[] => {
    const tagCounts: { [tag: string]: number } = {
      "#work": 0,
      "#job": 0,
    };

    notes.forEach((note) => {
      note.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const tagCountArray: TagCount[] = [];
    for (const tag in tagCounts) {
      tagCountArray.push({ tag, count: tagCounts[tag] });
    }

    return tagCountArray;
  };

  // write to localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  function extractAllIds(categories: Category[]) {
    const ids: string[] = [];

    function traverse(node: Category) {
      ids.push(node.value);
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => traverse(child));
      }
    }

    categories.forEach((category) => traverse(category));

    return ids;
  }

  useEffect(() => {
    if (!extractAllIds(categories).includes(selectedCategory?.value)) {
      setSelectedCategory(null);
    }
  }, [selectedCategory, categories]);

  const addNoteToList = (note: NoteInterface) => {
    setNotes([...notes, note]);
  };

  const deleteNote = (note: NoteInterface) => {
    const newNotes = notes.filter((element) => element.id !== note.id);
    setSelectedTags([]);
    setNotes(newNotes);
  };

  const editNote = () => {
    if (selectedNote) {
      const updatedNotes = notes.map((note) =>
        note.id === selectedNote.id ? selectedNote : note
      );
      setNotes(updatedNotes);
    }
  };

  const handleEditModalClose = () => {
    setSelectedNote(null);
  };

  const handleSelectTag = (tag: string) => {
    setSelectedTags((tags) => {
      if (tags.includes(tag)) {
        return tags.filter((t) => t !== tag);
      } else {
        return [...tags, tag];
      }
    });
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  const extractAllLabels = (categories: Category[]) => {
    const labels: string[] = [];

    function traverse(node: Category) {
      labels.push(node.label);
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => traverse(child));
      }
    }

    categories.forEach((category) => {
      traverse(category);
    });

    return labels;
  };

  const addCategory = (
    parent: Category | null,
    name: string | undefined
  ): void => {
    if (!name) return;
    const newCategory: Category = {
      value: crypto.randomUUID(),
      label: name,
      children: [],
    };

    const categoryLabels = extractAllLabels(categories);
    if (categoryLabels.includes(name)) {
      if (errorTextRef.current)
        // @ts-expect-error element exists
        errorTextRef.current.textContent = "This category already exists";
      return;
    }

    if (parent) {
      parent.children.push(newCategory);
      // @ts-expect-error element exists
      errorTextRef.current.textContent = "";
      setCategories([...categories]);
    } else {
      const allCategoryIndex = categories.findIndex(
        (category) => category.label === "All"
      );
      categories[allCategoryIndex].children.push(newCategory);
      // @ts-expect-error element exists
      errorTextRef.current.textContent = "";
      setCategories([...categories]);
    }
    if (newCategoryInputRef.current) {
      newCategoryInputRef.current.value = "";
    }
  };

  const editCategory = (
    category: Category,
    newName: string | undefined
  ): void => {
    if (!newName) return;
    const updateCategory = (node: Category): Category => {
      if (node.value === category.value) {
        return { ...node, label: newName };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map((child) => updateCategory(child)),
        };
      }
      return node;
    };

    const updatedCategories = categories.map((cat) => updateCategory(cat));
    setCategories(updatedCategories);
  };

  const deleteCategory = (categoryToDelete: Category): void => {
    const deleteCategoryRecursive = (category: Category): Category | null => {
      const updatedChildren = category.children
        .map((child) => deleteCategoryRecursive(child))
        .filter((child) => child !== null) as Category[];
      if (category.value === categoryToDelete.value) {
        return null;
      }
      return { ...category, children: updatedChildren };
    };

    const updatedCategories = categories
      .map(deleteCategoryRecursive)
      .filter((category) => category !== null) as Category[];

    setCategories(updatedCategories);

    const updatedNotes = notes.map((note) => {
      const updatedCategories = note.categories.filter(
        (category) => category.value !== categoryToDelete.value
      );
      return { ...note, categories: updatedCategories };
    });

    setNotes(updatedNotes);
  };

  const extractCategoryIds = (note: NoteInterface): string[] => {
    return note.categories.map((category) => category.value);
  };

  const filterNotes = (note: NoteInterface): boolean => {
    if (selectedCategory && selectedCategory.value !== allCategoryId) {
      const categoryIds = extractCategoryIds(note);
      if (!categoryIds.includes(selectedCategory.value)) {
        return false;
      }
    }

    if (selectedTags.length > 0) {
      if (!selectedTags.every((tag) => note.tags.includes(tag))) {
        return false;
      }
    }

    return true;
  };

  const handleAddCategoryKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      addCategory(selectedCategory, newCategoryInputRef?.current?.value);
      newCategoryInputRef.current!.value = "";
    }
  };

  return (
    <>
      <header>Light Notes</header>
      <main className="app-content">
        <div className="sidebar">
          <div className="categories-section">
            <CategoryTree
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              onEditCategory={editCategory}
              onDeleteCategory={deleteCategory}
            />
            <div className="new-category-block">
              <input
                ref={newCategoryInputRef}
                type="text"
                name="new-category"
                placeholder={
                  selectedCategory?.label
                    ? `Add to ${selectedCategory.label}`
                    : "Choose category to add"
                }
                onKeyDown={handleAddCategoryKeyPress}
              />
              <button
                className="add-category-btn"
                type="button"
                onClick={() =>
                  addCategory(
                    selectedCategory,
                    newCategoryInputRef?.current?.value
                  )
                }
              >
                <span className="material-symbols-outlined plus-icon">add</span>
              </button>
            </div>
            <span ref={errorTextRef} className="error-text"></span>
          </div>
          <div className="tags-section">
            <TagPicker
              tags={extractTags(notes)}
              selectedTags={selectedTags}
              onSelectTag={handleSelectTag}
            />
          </div>
        </div>
        <div className="notes-section">
          <div className="add-note-container">
            <AddNote
              categories={categories}
              selectedCategory={selectedCategory}
              onAddNote={addNoteToList}
            />
          </div>
          <div className="notes-container">
            <NoteList
              notes={notes.filter(filterNotes)}
              onDeleteNote={deleteNote}
              onEditNote={setSelectedNote}
            />
          </div>
        </div>
      </main>
      {selectedNote && (
        <EditModal
          note={selectedNote}
          onCloseModal={handleEditModalClose}
          onSaveNote={editNote}
          onChangeNote={setSelectedNote}
          categories={categories}
        />
      )}
    </>
  );
}

export default App;
