import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { updateTaskStatus } from '../store/taskSlice';
import { TaskColumn } from '../components/TaskColumn';
import { NewTaskDialog } from '../components/NewTaskDialog';

const Index = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    dispatch(updateTaskStatus({
      taskId: draggableId,
      status: destination.droppableId as 'todo' | 'inProgress' | 'done'
    }));
  };

  const columns = {
    todo: tasks.filter(task => task.status === 'todo'),
    inProgress: tasks.filter(task => task.status === 'inProgress'),
    done: tasks.filter(task => task.status === 'done')
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Task Management</h1>
          <NewTaskDialog />
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            <TaskColumn
              id="todo"
              title="To Do"
              tasks={columns.todo}
            />
            <TaskColumn
              id="inProgress"
              title="In Progress"
              tasks={columns.inProgress}
            />
            <TaskColumn
              id="done"
              title="Done"
              tasks={columns.done}
            />
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Index;