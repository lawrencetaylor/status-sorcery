import { Droppable } from 'react-beautiful-dnd';
import { TaskCard } from './TaskCard';
import type { Task } from '../store/taskSlice';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  id: string;
}

export const TaskColumn = ({ title, tasks, id }: TaskColumnProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg w-80">
      <h2 className="font-semibold mb-4 text-lg">{title}</h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[500px]"
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};