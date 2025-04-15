import React, { useState, useEffect } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { Dashboard } from './components/Dashboard';
import { TaskReport } from './components/TaskReport';
import { ClipboardList } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    // Check for pending tasks every minute
    const interval = setInterval(() => {
      const pendingTasks = tasks.filter(task => task.status === 'pending');
      if (pendingTasks.length > 0) {
        toast('You have pending tasks waiting for your attention!', {
          icon: '⏰',
          duration: 5000,
        });
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  const handleAddTask = (newTask) => {
    setTasks((prev) => [
      ...prev,
      {
        ...newTask,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      },
    ]);
    toast.success('New task added successfully!');
  };

  const handleStatusChange = (id, status) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          if (status === 'completed' && task.status !== 'completed') {
            toast.success('Congratulations! Task completed! 🎉', {
              icon: '🎉',
              duration: 5000,
            });
          }
          return { ...task, status };
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    toast.success('Task deleted successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white px-6 py-4 rounded-full shadow-md flex items-center">
            <ClipboardList className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-8">
            <TaskForm onSubmit={handleAddTask} />
            <div className="flex justify-end">
              <button
                onClick={() => setShowReport(!showReport)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out"
              >
                {showReport ? 'Hide Report' : 'Show Report'}
              </button>
            </div>
            {showReport && <TaskReport tasks={tasks} />}
            <TaskList
              tasks={tasks}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteTask}
            />
          </div>
          <div className="lg:col-span-7">
            <div className="sticky top-8">
              <Dashboard tasks={tasks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;