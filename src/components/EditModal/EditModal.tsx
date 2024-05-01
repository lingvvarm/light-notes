import './EditModal.scss';
import NoteInterface from '../Note/NoteInterface';
import { ChangeEvent } from 'react';

interface EditModalProps {
    note: NoteInterface;
    onCloseModal: () => void;
    onSaveNote: () => void;
    onChangeNote: (note: NoteInterface) => void;
}


function EditModal({ note, onCloseModal, onSaveNote, onChangeNote }: EditModalProps) {
  
    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    onChangeNote({
      ...note,
      [name]: value
    });
  };

  const handleSave = () => {
    onSaveNote();
    onCloseModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
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
        <button type="button" onClick={handleSave}>Save</button>
        <button type="button" onClick={onCloseModal}>Cancel</button>
      </div>
    </div>
  );
}

export default EditModal;
