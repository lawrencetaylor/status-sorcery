import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, updateCategory, deleteCategory } from '../store/taskSlice';
import { RootState } from '../store/store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { X, Edit2 } from 'lucide-react';

const PRESET_COLORS = [
  '#9b87f5', // Primary Purple
  '#F97316', // Bright Orange
  '#0EA5E9', // Ocean Blue
  '#D946EF', // Magenta Pink
  '#8B5CF6', // Vivid Purple
  '#33C3F0', // Sky Blue
  '#ea384c', // Red
  '#1EAEDB', // Bright Blue
];

export const CategoryManagementDialog = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.tasks.categories);
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(PRESET_COLORS[0]);
  const [editingCategory, setEditingCategory] = useState<{ 
    original: string; 
    new: string;
    color: string;
  } | null>(null);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      dispatch(addCategory({ 
        name: newCategory.trim(), 
        color: newCategoryColor 
      }));
      setNewCategory('');
      setNewCategoryColor(PRESET_COLORS[0]);
    }
  };

  const handleUpdateCategory = (oldName: string) => {
    if (editingCategory && editingCategory.new.trim() && editingCategory.new !== oldName) {
      dispatch(updateCategory({ 
        oldName, 
        newName: editingCategory.new.trim(),
        color: editingCategory.color
      }));
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (category: string) => {
    dispatch(deleteCategory(category));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-6 ml-4">Manage Categories</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button type="submit">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    newCategoryColor === color ? 'border-black' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewCategoryColor(color)}
                />
              ))}
            </div>
          </form>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between gap-2 p-2 border rounded-md">
                {editingCategory?.original === category.name ? (
                  <div className="flex-1 space-y-2">
                    <Input
                      value={editingCategory.new}
                      onChange={(e) => setEditingCategory({ 
                        ...editingCategory, 
                        new: e.target.value 
                      })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateCategory(category.name);
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex flex-wrap gap-2">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-6 h-6 rounded-full border-2 ${
                            editingCategory.color === color ? 'border-black' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setEditingCategory({ 
                            ...editingCategory, 
                            color 
                          })}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (editingCategory?.original === category.name) {
                        handleUpdateCategory(category.name);
                      } else {
                        setEditingCategory({ 
                          original: category.name, 
                          new: category.name,
                          color: category.color
                        });
                      }
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCategory(category.name)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};