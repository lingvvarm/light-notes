import { useState, useRef, useEffect } from 'react';
import { ChangeEvent } from 'react';
import './AddNote.scss';
import NoteInterface from '../Note/NoteInterface';
import ColorPicker from '../ColorPicker/ColorPicker';

const ExpandableInput = ({ onAddNote }: { onAddNote: (note: NoteInterface) => void }) => {
  const initValue = {id: crypto.randomUUID(), title: '', text: '', color: ''};
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState(initValue);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleAdd = function() {
    if (formData.text.length === 0 && formData.title.length === 0) {
        setIsExpanded(false);
        return;
    }
    if (formData.title.length === 0) formData.title = 'new note';
    onAddNote(formData);
    setIsExpanded(false);
    setFormData(initValue);
  }

  const handleClose = function() {
    setIsExpanded(false);
    setFormData(initValue);
  }

  const handleColorChange = function(color: string) {
    setFormData({...formData, color});
  }


  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      handleClose();
    }
  };

  useEffect(() => {
    
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  const handleInputClick = () => {
    setIsExpanded(true);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div style={{ backgroundColor: formData.color }} className="addNoteForm" ref={inputRef}>
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
            />
            <input
              name="text"
              type="text"
              placeholder="Take a note..."
              value={formData.text}
              onChange={handleInputChange}
            />
          </div>
          <div className="btns-block">
            <ColorPicker changeColor={handleColorChange}/>
            <button type="button" className="add-note-btn" onClick={handleAdd}>
              Add
            </button>
            <button type="button" className="add-note-btn" onClick={handleClose}>
              Close
            </button>
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
};

export default ExpandableInput;
