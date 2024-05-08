import "./EditModal.scss";
import NoteInterface from "../Note/NoteInterface";
import { ChangeEvent } from "react";
import { useEffect, useRef } from "react";
import ColorPicker from "../ColorPicker/ColorPicker";
import CategoryPicker, {
  CategorySelect,
} from "../CategoryPicker/CategoryPicker";
import { Category } from "../CategoryTree/CategoryTree";

interface EditModalProps {
  note: NoteInterface;
  onCloseModal: () => void;
  onSaveNote: () => void;
  onChangeNote: (note: NoteInterface) => void;
  categories: Category[];
}

function EditModal({
  note,
  onCloseModal,
  onSaveNote,
  onChangeNote,
  categories,
}: EditModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onCloseModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCloseModal]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const found_tags =
      name === "text" ? value.match(/#[^\s#]+/g) || [] : note.tags;
    onChangeNote({
      ...note,
      [name]: value,
      tags: found_tags,
    });
  };

  const handleColorEdit = function (colorHex: string) {
    onChangeNote({ ...note, color: colorHex });
  };

  const handleCategoryEdit = function (categories: CategorySelect[]) {
    onChangeNote({ ...note, categories });
  };

  const handleSave = () => {
    onSaveNote();
    onCloseModal();
  };

  return (
    <div className="modal-overlay">
      <div
        style={{ backgroundColor: note.color }}
        className="modal"
        ref={modalRef}
      >
        <div className="editor-section">
          <input
            type="text"
            name="title"
            value={note.title}
            onChange={handleInputChange}
          />
          <textarea
            name="text"
            value={note.text}
            onChange={handleInputChange}
          />
        </div>
        <div className="edit-modal-btns">
          <CategoryPicker
            categories={categories}
            currentCategories={note.categories}
            onChangeSelect={handleCategoryEdit}
          />
          <div className="edit-modal-right-btns">
            <ColorPicker changeColor={handleColorEdit} />
            <button type="button" onClick={handleSave}>
              Save
            </button>
            <button type="button" onClick={onCloseModal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
