import './EditModal.scss';
import NoteInterface from '../Note/NoteInterface';
import { ChangeEvent, useRef } from 'react';
import { useEffect } from 'react';
import ColorPicker from '../ColorPicker/ColorPicker';

interface EditModalProps {
    note: NoteInterface;
    onCloseModal: () => void;
    onSaveNote: () => void;
    onChangeNote: (note: NoteInterface) => void;
}


function EditModal({ note, onCloseModal, onSaveNote, onChangeNote }: EditModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCloseModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCloseModal]);


    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    onChangeNote({
      ...note,
      [name]: value
    });
  };

    const handleColorEdit = function(colorHex: string) {
      onChangeNote({ ...note, color: colorHex });
    };
 

  const handleSave = () => {
    onSaveNote();
    onCloseModal();
  };

  return (
    <div className="modal-overlay" >
      <div style={{ backgroundColor: note.color }} className="modal" ref={modalRef}>
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
        <div className="edit-btns">
          <ColorPicker changeColor={handleColorEdit}/>
          <button type="button" onClick={handleSave}>Save</button>
          <button type="button" onClick={onCloseModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
