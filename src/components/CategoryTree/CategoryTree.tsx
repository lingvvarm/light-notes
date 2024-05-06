import React, { useState } from 'react';
import './CategoryTree.scss';

export interface Category {
    id: string;
    name: string;
    children: Category[];
  }

interface CategoryTreeProps {
  categories: Category[];
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  onAddCategory: (parent: Category | null, name: string) => void;
  onEditCategory: (category: Category, newName: string) => void;
  onDeleteCategory: (category: Category) => void;
  depth?: number;
}

function CategoryTree({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  depth = 0,
}: CategoryTreeProps) {
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState<string>('');

  const handleCategoryClick = (event: React.MouseEvent, subcategory: Category) => {
    event.stopPropagation();
    onSelectCategory(subcategory);
  };

  const handleDeleteCategory = (event: React.MouseEvent, category: Category) => {
    event.stopPropagation();
    onDeleteCategory(category);
  };

  const handleEditCategory = (category: Category) => {
    setEditCategoryId(category.id);
    setEditedCategoryName(category.name);
  };

  const handleSaveCategory = (category: Category) => {
    onEditCategory(category, editedCategoryName);
    setEditCategoryId(null);
  };

  return (
    <ul>
      {categories.map((category) => (
        <li
          key={category.id}
          className={selectedCategory?.id === category.id ? 'category-item selected-category' : 'category-item'}
          onClick={(event) => handleCategoryClick(event, category)}
        >
          {editCategoryId === category.id ? (
            <input
              type="text"
              value={editedCategoryName}
              onChange={(e) => setEditedCategoryName(e.target.value)}
            />
          ) : (
            <span style={{ marginLeft: `${depth * 20}px` }}>{category.name}</span>
          )}
          {editCategoryId === category.id ? (
            <button onClick={() => handleSaveCategory(category)}>Save</button>
          ) : (
            <button onClick={() => handleEditCategory(category)}>Edit</button>
          )}
          <button onClick={(event) => handleDeleteCategory(event, category)}>Delete</button>
          {category.children.length > 0 && (
            <CategoryTree
              categories={category.children}
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
              onAddCategory={onAddCategory}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
              depth={depth + 1}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

export default CategoryTree;
