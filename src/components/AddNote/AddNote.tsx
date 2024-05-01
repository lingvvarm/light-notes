import { useState, useRef, useEffect } from 'react';
import { ChangeEvent } from 'react';
import './AddNote.scss';
import NoteInterface from '../Note/NoteInterface';

const ExpandableInput = ({ onAddNote }: { onAddNote: (note: NoteInterface) => void }) => {
  const initValue = {id: crypto.randomUUID(), title: '', text: ''};
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState(initValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef(null);
  
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
    <div className="addNoteForm" ref={inputRef}>
      {isExpanded ? (
        <>
          <input
            name="title"
            className="title-input"
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
          />
          <input
            ref={textInputRef}
            name="text"
            type="text"
            placeholder="Take a note..."
            value={formData.text}
            onChange={handleInputChange}
          />
          <div className="btns-block">
            <button type="button" className="close-btn" onClick={handleAdd}>
              Add
            </button>
            <button type="button" className="close-btn" onClick={handleClose}>
              Close
            </button>
          </div>
        </>
      ) : (
        <input
          type="text"
          onClick={handleInputClick}
          placeholder="Take a note..."
          value=""
          readOnly
        />
      )}
    </div>
  );
};

export default ExpandableInput;
