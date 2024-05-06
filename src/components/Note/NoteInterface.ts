import { CategorySelect } from "../CategoryPicker/CategoryPicker";
interface NoteInterface {
  id: string;
  title: string;
  text: string;
  color: string;
  tags: string[];
  categories: CategorySelect[];
}

export default NoteInterface;
