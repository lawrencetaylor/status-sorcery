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

export const CategoryManagementDialog = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.tasks.categories);
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newColor, setNewColor] = useState('#9b87f5');
  const [editingCategory, setEditingCategory] = useState<{ original: string; new: string; color: string } | null>(null);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      dispatch(addCategory({ name: newCategory.trim(), color: newColor }));
      setNewCategory('');
      setNewColor('#9b87f5');
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

  const handleDeleteCategory = (categoryName: string) => {
    dispatch(deleteCategory(categoryName));
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
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-14 p-1 h-10"
              />
            </div>
            <Button type="submit">Add</Button>
          </form>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between gap-2 p-2 border rounded-md">
                {editingCategory?.original === category.name ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={editingCategory.new}
                      onChange={(e) => setEditingCategory({ ...editingCategory, new: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateCategory(category.name);
                        }
                      }}
                      onBlur={() => handleUpdateCategory(category.name)}
                      autoFocus
                    />
                    <Input
                      type="color"
                      value={editingCategory.color}
                      onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                      className="w-14 p-1 h-10"
                    />
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