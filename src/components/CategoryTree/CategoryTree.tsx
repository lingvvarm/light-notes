import { useState } from "react";
import "./CategoryTree.scss";
import "rsuite/dist/rsuite.min.css";
import { Tree } from "rsuite";

export interface Category {
  value: string;
  label: string;
  children: Category[];
}

interface CategoryTreeProps {
  categories: Category[];
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  onEditCategory: (category: Category, newName: string) => void;
  onDeleteCategory: (category: Category) => void;
}

function CategoryTree({
  categories,
  onSelectCategory,
  onEditCategory,
  onDeleteCategory,
}: CategoryTreeProps) {
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState<string>("");

  const handleDeleteCategory = (category: Category) => {
    onDeleteCategory(category);
  };

  const handleEditCategory = (category: Category) => {
    setEditCategoryId(category.value);
    setEditedCategoryName(category.label);
  };

  const handleSaveCategory = (category: Category) => {
    onEditCategory(category, editedCategoryName);
    setEditCategoryId(null);
  };

  const renderTreeNode = (node: Category) => {
    if (node.label === "All") {
      return (
        <div className="tree-node">
          <span>{node.label}</span>
        </div>
      );
    }
    if (editCategoryId === node.value) {
      return (
        <>
          <div className="tree-node">
            <input
              type="text"
              value={editedCategoryName}
              onChange={(e) => setEditedCategoryName(e.target.value)}
              className="category-edit-input"
            />
            <button
              className="tree-node-btn"
              type="button"
              onClick={() => handleSaveCategory(node)}
            >
              <span className="material-symbols-outlined">save</span>
            </button>
            <button
              className="tree-node-btn"
              type="button"
              onClick={() => handleDeleteCategory(node)}
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="tree-node">
          <span>{node.label}</span>
          <button
            className="tree-node-btn"
            type="button"
            onClick={() => handleEditCategory(node)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#434343"
            >
              <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
            </svg>
          </button>
          <button
            className="tree-node-btn"
            type="button"
            onClick={() => handleDeleteCategory(node)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#434343"
            >
              <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
            </svg>
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <Tree
        data={categories}
        // @ts-expect-error library inner types
        renderTreeNode={renderTreeNode}
        // @ts-expect-error library inner types
        onSelect={onSelectCategory}
        defaultValue={categories[0].value}
        defaultExpandAll
      />
    </>
  );
}

export default CategoryTree;
