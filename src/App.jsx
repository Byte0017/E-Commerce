import { useState } from 'react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState(() => {
    const loadedTasks = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const taskData = JSON.parse(localStorage.getItem(key));
      if (taskData) loadedTasks.push({ id: key, ...taskData });
    }
    return loadedTasks.sort((a, b) => b.id - a.id);
  });

  const addTask = (task, priority) => {
    const id =
      localStorage.length > 0
        ? Math.max(...Object.keys(localStorage).map(Number)) + 1
        : 1;
    const taskData = { task, priority, timestamp: new Date().toISOString() };
    localStorage.setItem(id, JSON.stringify(taskData));
    setTasks((prev) => [{ id: String(id), ...taskData }, ...prev]);
  };

  const deleteTask = (id) => {
    localStorage.removeItem(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const editTask = (id, updatedTask) => {
    const taskData = JSON.parse(localStorage.getItem(id));
    taskData.task = updatedTask;
    localStorage.setItem(id, JSON.stringify(taskData));
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, task: updatedTask } : task
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect py-4 px-6 shadow-luxury">
        <h1 className="text-2xl font-bold text-neutral bg-clip-text text-transparent bg-button-gradient">
          Vocal Sync
        </h1>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center pt-20 px-6 z-10">
        <div className="w-full max-w-2xl space-y-6">
          <TaskInput addTask={addTask} />
          <TaskList tasks={tasks} deleteTask={deleteTask} editTask={editTask} />
        </div>
      </main>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          nav {
            padding: 1rem;
          }
          h1 {
            font-size: 1.5rem;
          }
          .pt-20 {
            padding-top: 5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default App;