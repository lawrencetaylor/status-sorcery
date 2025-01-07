import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { updateTaskDueDate } from '../store/taskSlice';
import type { Task } from '../store/taskSlice';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface TaskCardProps {
  task: Task;
  index: number;
}

export const TaskCard = ({ task, index }: TaskCardProps) => {
  const dispatch = useDispatch();

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 mb-4 rounded-lg bg-white shadow-sm border ${
            snapshot.isDragging ? 'shadow-lg' : ''
          }`}
        >
          <h3 className="font-semibold mb-2">{task.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
          <div className="flex items-center justify-between">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-8 text-xs">
                  <Calendar className="mr-2 h-4 w-4" />
                  {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'Set due date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={task.dueDate ? new Date(task.dueDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      dispatch(updateTaskDueDate({
                        taskId: task.id,
                        dueDate: date.toISOString()
                      }));
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </Draggable>
  );
};