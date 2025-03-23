import { useState } from 'react';

function TaskList({ tasks, deleteTask, editTask }) {
  return (
    <div className="bg-card-bg p-6 glass-effect shadow-luxury animate-slide-in">
      <h2 className="text-lg font-semibold text-neutral mb-4">Tasks ({tasks.length})</h2>
      {tasks.length === 0 ? (
        <p className="text-center text-neutral-light text-sm">No tasks yet.</p>
      ) : (
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={deleteTask}
              onEdit={editTask}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 640px) {
          .p-6 {
            padding: 1rem;
          }
          .max-h-80 {
            max-height: 16rem;
          }
        }
      `}</style>
    </div>
  );
}

function TaskItem({ task, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.task);

  const handleEdit = () => {
    if (isEditing && text.trim()) {
      onEdit(task.id, text);
    }
    setIsEditing(!isEditing);
  };

  const priorityStyles = {
    low: 'border-l-4 border-primary bg-primary/5',
    medium: 'border-l-4 border-highlight bg-highlight/5',
    high: 'border-l-4 border-accent bg-accent/5',
  };

  return (
    <div className={`p-4 rounded-lg shadow-md hover-scale glass-effect ${priorityStyles[task.priority]}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-neutral-light bg-neutral/10 px-2 py-1 rounded-full">
          {new Date(task.timestamp).toLocaleString([], {
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'short',
          })}
        </span>
        <span className="text-xs text-neutral-light capitalize bg-neutral/10 px-2 py-1 rounded-full">
          {task.priority}
        </span>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        readOnly={!isEditing}
        className="w-full p-2 bg-transparent border-none focus:ring-2 focus:ring-primary/50 focus:outline-none text-sm text-neutral resize-none transition-all duration-300"
        rows={2}
      />
      <div className="flex gap-2 mt-2 flex-wrap">
        <button
          onClick={handleEdit}
          className="flex-1 bg-primary/10 text-primary py-1 px-3 rounded-lg hover-scale focus:ring-2 focus:ring-primary/30 focus:outline-none text-sm"
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="flex-1 bg-accent/10 text-accent py-1 px-3 rounded-lg hover-scale focus:ring-2 focus:ring-accent/30 focus:outline-none text-sm"
        >
          Delete
        </button>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .p-4 {
            padding: 0.75rem;
          }
          .flex-wrap {
            flex-direction: column;
            gap: 0.5rem;
          }
          button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default TaskList;