import React from 'react';
import { cn } from '../../lib/utils';
import { Category } from '../../lib/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <button
          className={cn(
            "px-4 py-1.5 text-sm rounded-full transition-colors",
            selectedCategory === null
              ? "bg-primary-500 text-white"
              : "bg-white border border-secondary-300 text-secondary-700 hover:bg-secondary-50"
          )}
          onClick={() => onSelectCategory(null)}
        >
          All
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            className={cn(
              "px-4 py-1.5 text-sm rounded-full transition-colors",
              selectedCategory === category.id
                ? "bg-primary-500 text-white"
                : "bg-white border border-secondary-300 text-secondary-700 hover:bg-secondary-50"
            )}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name} ({category.appCount})
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;