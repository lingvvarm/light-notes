import "./TagPicker.scss";

export interface TagCount {
  tag: string;
  count: number;
}
interface TagPickerProps {
  tags: TagCount[];
  selectedTags: string[];
  onSelectTag: (tag: string) => void;
}

function TagPicker({ tags, selectedTags, onSelectTag }: TagPickerProps) {
  return (
    <ul className="tag-list">
      {tags.map((tag, index) => {
        const isSelected = selectedTags.includes(tag.tag);
        return (
          <li
            key={index}
            className={isSelected ? "selected" : ""}
            onClick={() => onSelectTag(tag.tag)}
            data-weight={`${tag.count}`}
          >
            {tag.tag}
          </li>
        );
      })}
    </ul>
  );
}

export default TagPicker;
