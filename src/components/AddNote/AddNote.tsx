import "./AddNote.scss";
import { useState, useRef, useEffect } from "react";
import NoteInterface from "../Note/NoteInterface";
import ColorPicker from "../ColorPicker/ColorPicker";
import CategoryPicker, {
  CategorySelect,
} from "../CategoryPicker/CategoryPicker";
import { Category } from "../CategoryTree/CategoryTree";

interface ExpandableInputProps {
  categories: Category[];
  selectedCategory: Category | null;
  onAddNote: (note: NoteInterface) => void;
}

function AddNote({
  categories,
  selectedCategory,
  onAddNote,
}: ExpandableInputProps) {
  console.log(selectedCategory);
  const initValue = {
    id: crypto.randomUUID(),
    title: "",
    text: "",
    color: "",
    tags: [],
    categories: selectedCategory ? [selectedCategory] : [],
  };
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState(initValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (selectedCategory) {
      setFormData((prevData) => ({
        ...prevData,
        categories: [selectedCategory],
      }));
    }
  }, [selectedCategory]);

  const handleAdd = () => {
    if (formData.text.length === 0 && formData.title.length === 0) {
      setIsExpanded(false);
      return;
    }
    if (formData.title.length === 0) formData.title = "new note";
    const tag_regex = /#[^\s#]+/g;
    const found_tags = formData.text.match(tag_regex) || [];
    onAddNote({ ...formData, tags: found_tags });
    setIsExpanded(false);
    setFormData(initValue);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setFormData(initValue);
  };

  const handleColorChange = (color: string) => {
    setFormData({ ...formData, color });
  };

  const handleCategoryChange = (categories: CategorySelect[]) => {
    // @ts-expect-error handled
    setFormData({ ...formData, categories });
  };

  const handleInputClick = () => {
    setIsExpanded(true);
  };

  // @ts-expect-error heave appropriate event type
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      handleClose();
    }
  };

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleFieldSwitch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // @ts-expect-error element exists
      if (textareaRef.current) textareaRef.current.focus();
    }
  };

  return (
    <div
      style={{ backgroundColor: formData.color }}
      className="addNoteForm"
      ref={inputRef}
    >
      {isExpanded ? (
        <>
          <div className="inputs-container">
            <input
              name="title"
              className="title-input"
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
              onKeyDown={handleFieldSwitch}
            />
            <textarea
              ref={textareaRef}
              name="text"
              placeholder="Take a note... (use # for tags)"
              value={formData.text}
              onChange={handleInputChange}
            />
          </div>
          <div className="btns-block">
            <CategoryPicker
              categories={categories}
              currentCategories={
                selectedCategory !== null ? [selectedCategory] : null
              }
              onChangeSelect={handleCategoryChange}
            />
            <div className="add-note-right-btns">
              <ColorPicker changeColor={handleColorChange} />
              <button
                type="button"
                className="add-note-btn"
                onClick={handleAdd}
              >
                Add
              </button>
              <button
                type="button"
                className="add-note-btn"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="inputs-container">
          <input
            type="text"
            onClick={handleInputClick}
            placeholder="Take a note..."
            value=""
            readOnly
          />
        </div>
      )}
    </div>
  );
}

export default AddNote;
