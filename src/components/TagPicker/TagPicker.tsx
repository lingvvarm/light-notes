import './TagPicker.scss'

interface TagPickerProps {
    tags: string[];
    selectedTags: string[];
    onSelectTag: (tag: string) => void
}

function TagPicker({ tags, selectedTags, onSelectTag }: TagPickerProps) {
    return (
        <ul>
      {tags.map((tag, index) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <li
            key={index}
            className={isSelected ? 'selected' : ''}
            onClick={() => onSelectTag(tag)}
          >
            {tag}
          </li>
        );
      })}
    </ul>
    )
}

export default TagPicker;