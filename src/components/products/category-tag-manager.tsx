/**
 * CategoryTagManager Component
 * Phase 26.4.2: Category & Tag Management
 * 
 * Features:
 * - Hierarchical category management
 * - Tag creation and assignment
 * - Bulk category/tag operations
 * - Search and filter
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { 
  FolderTree, Tag, Plus, Trash2, Edit2, Save, X, 
  ChevronRight, ChevronDown, Search, Check 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  description?: string;
  productCount: number;
  children?: Category[];
}

export interface ProductTag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  productCount: number;
}

interface CategoryTagManagerProps {
  categories: Category[];
  tags: ProductTag[];
  selectedCategories: string[];
  selectedTags: string[];
  onCategorySelect: (categoryIds: string[]) => void;
  onTagSelect: (tagIds: string[]) => void;
  onCategoryCreate?: (category: Omit<Category, 'id' | 'productCount'>) => void;
  onTagCreate?: (tag: Omit<ProductTag, 'id' | 'productCount'>) => void;
  onCategoryDelete?: (categoryId: string) => void;
  onTagDelete?: (tagId: string) => void;
  className?: string;
}

const TAG_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280', '#000000',
];

export function CategoryTagManager({
  categories,
  tags,
  selectedCategories,
  selectedTags,
  onCategorySelect,
  onTagSelect,
  onCategoryCreate,
  onTagCreate,
  onCategoryDelete,
  onTagDelete,
  className,
}: CategoryTagManagerProps) {
  const [activeTab, setActiveTab] = useState<'categories' | 'tags'>('categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', parentId: null as string | null, description: '' });
  const [newTag, setNewTag] = useState({ name: '', slug: '', color: TAG_COLORS[0] });

  // Build category tree
  const categoryTree = useMemo(() => {
    const buildTree = (parentId: string | null): Category[] => {
      return categories
        .filter(c => c.parentId === parentId)
        .map(c => ({
          ...c,
          children: buildTree(c.id),
        }));
    };
    return buildTree(null);
  }, [categories]);

  // Filter categories by search
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categoryTree;
    const query = searchQuery.toLowerCase();
    const filterTree = (cats: Category[]): Category[] => {
      return cats.reduce<Category[]>((acc, cat) => {
        const matches = cat.name.toLowerCase().includes(query);
        const filteredChildren = cat.children ? filterTree(cat.children) : [];
        if (matches || filteredChildren.length > 0) {
          acc.push({ ...cat, children: filteredChildren });
        }
        return acc;
      }, []);
    };
    return filterTree(categoryTree);
  }, [categoryTree, searchQuery]);

  // Filter tags by search
  const filteredTags = useMemo(() => {
    if (!searchQuery) return tags;
    const query = searchQuery.toLowerCase();
    return tags.filter(t => t.name.toLowerCase().includes(query));
  }, [tags, searchQuery]);

  // Toggle category expansion
  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Toggle category selection
  const toggleCategorySelect = (categoryId: string) => {
    const isSelected = selectedCategories.includes(categoryId);
    if (isSelected) {
      onCategorySelect(selectedCategories.filter(id => id !== categoryId));
    } else {
      onCategorySelect([...selectedCategories, categoryId]);
    }
  };

  // Toggle tag selection
  const toggleTagSelect = (tagId: string) => {
    const isSelected = selectedTags.includes(tagId);
    if (isSelected) {
      onTagSelect(selectedTags.filter(id => id !== tagId));
    } else {
      onTagSelect([...selectedTags, tagId]);
    }
  };

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  // Handle add category
  const handleAddCategory = () => {
    if (!newCategory.name) return;
    onCategoryCreate?.({
      ...newCategory,
      slug: newCategory.slug || generateSlug(newCategory.name),
    });
    setNewCategory({ name: '', slug: '', parentId: null, description: '' });
    setIsAddingCategory(false);
  };

  // Handle add tag
  const handleAddTag = () => {
    if (!newTag.name) return;
    onTagCreate?.({
      ...newTag,
      slug: newTag.slug || generateSlug(newTag.name),
    });
    setNewTag({ name: '', slug: '', color: TAG_COLORS[0] });
    setIsAddingTag(false);
  };

  // Render category item
  const renderCategory = (category: Category, depth: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategories.includes(category.id);

    return (
      <div key={category.id}>
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-2 hover:bg-muted/50 rounded-md cursor-pointer',
            isSelected && 'bg-primary/10'
          )}
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
        >
          {hasChildren ? (
            <button onClick={() => toggleExpand(category.id)} className="p-0.5">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          ) : (
            <span className="w-5" />
          )}
          <button
            onClick={() => toggleCategorySelect(category.id)}
            className={cn(
              'w-4 h-4 rounded border flex items-center justify-center',
              isSelected ? 'bg-primary border-primary' : 'border-border'
            )}
          >
            {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
          </button>
          <FolderTree className="w-4 h-4 text-muted-foreground" />
          <span className="flex-1 text-sm">{category.name}</span>
          <span className="text-xs text-muted-foreground">{category.productCount}</span>
          {onCategoryDelete && (
            <button
              onClick={() => onCategoryDelete(category.id)}
              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {category.children!.map(child => renderCategory(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('categories')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
            activeTab === 'categories'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <FolderTree className="w-4 h-4 inline mr-2" />
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
            activeTab === 'tags'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Tag className="w-4 h-4 inline mr-2" />
          Tags ({tags.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeTab}...`}
          className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background text-sm"
        />
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          {/* Add Category Button */}
          {onCategoryCreate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingCategory(true)}
              disabled={isAddingCategory}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          )}

          {/* Add Category Form */}
          {isAddingCategory && (
            <div className="p-4 border border-border rounded-lg bg-card space-y-3">
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory(c => ({ ...c, name: e.target.value }))}
                placeholder="Category name"
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
              />
              <select
                value={newCategory.parentId || ''}
                onChange={(e) => setNewCategory(c => ({ ...c, parentId: e.target.value || null }))}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
              >
                <option value="">No parent (root category)</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddCategory} disabled={!newCategory.name}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsAddingCategory(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Category Tree */}
          <div className="border border-border rounded-lg divide-y divide-border">
            {filteredCategories.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No categories found
              </div>
            ) : (
              <div className="p-2">
                {filteredCategories.map(cat => renderCategory(cat))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tags Tab */}
      {activeTab === 'tags' && (
        <div className="space-y-4">
          {/* Add Tag Button */}
          {onTagCreate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingTag(true)}
              disabled={isAddingTag}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Tag
            </Button>
          )}

          {/* Add Tag Form */}
          {isAddingTag && (
            <div className="p-4 border border-border rounded-lg bg-card space-y-3">
              <input
                type="text"
                value={newTag.name}
                onChange={(e) => setNewTag(t => ({ ...t, name: e.target.value }))}
                placeholder="Tag name"
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
              />
              <div className="flex gap-2">
                {TAG_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewTag(t => ({ ...t, color }))}
                    className={cn(
                      'w-6 h-6 rounded-full border-2',
                      newTag.color === color ? 'border-foreground' : 'border-transparent'
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddTag} disabled={!newTag.name}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsAddingTag(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Tags Grid */}
          <div className="flex flex-wrap gap-2">
            {filteredTags.length === 0 ? (
              <div className="w-full p-8 text-center text-muted-foreground border border-dashed border-border rounded-lg">
                No tags found
              </div>
            ) : (
              filteredTags.map(tag => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTagSelect(tag.id)}
                    className={cn(
                      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors',
                      isSelected
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'hover:opacity-80'
                    )}
                    style={{
                      backgroundColor: tag.color ? `${tag.color}20` : undefined,
                      color: tag.color,
                      borderColor: tag.color,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                    <span className="text-xs opacity-60">({tag.productCount})</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Selection Summary */}
      <div className="p-3 bg-muted/50 rounded-lg text-sm">
        <span className="text-muted-foreground">Selected: </span>
        <span className="font-medium">{selectedCategories.length} categories, {selectedTags.length} tags</span>
      </div>
    </div>
  );
}

