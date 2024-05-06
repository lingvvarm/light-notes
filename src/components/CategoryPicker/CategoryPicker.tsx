import Select from 'react-select'
import { Category } from '../CategoryTree/CategoryTree';

export interface CategorySelect {
  value: string;
  label: string;
}

interface CategoryPickerProps {
  categories: Category[];
  currentCategories: CategorySelect[] | Category[] | null;
  onChangeSelect: (categories: CategorySelect[]) => void
}

function CategoryPicker({ categories, currentCategories, onChangeSelect }: CategoryPickerProps) {

    const extractCategories = (categories: Category[]) => {
        const flatCategories: CategorySelect[] = [];
      
        const extract = (category: Category) => {
          flatCategories.push({ value: category.id, label: category.name });
      
          if (category.children && category.children.length > 0) {
            category.children.forEach((child) => {
              extract(child);
            });
          }
        };
      
        categories.forEach((category) => {
          extract(category);
        });
      
        return flatCategories;
      };
    
    
    const selectOptions = extractCategories(categories);
    let defaultOptions;


    if (currentCategories) {
      if (currentCategories?.length > 0) {
        if (currentCategories[0]?.value && currentCategories[0]?.label) {
          defaultOptions = currentCategories;
        }
        else {
          console.log(currentCategories);
          defaultOptions = currentCategories?.map((category) => ({ value: category.id, label: category.name }));
        }
      }
      else {
        defaultOptions = null;
      }
    }
    
    return (
        // @ts-expect-error built-in types of library component
        <Select options={selectOptions} onChange={onChangeSelect} defaultValue={defaultOptions} placeholder='Categories...' isMulti isClearable={false}/>
    )
}

export default CategoryPicker;