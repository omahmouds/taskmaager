import React from 'react';
import PropTypes from 'prop-types';
import { Trash2, Clock, CheckCircle, RotateCw, Calendar } from 'lucide-react';

export function TaskList({ tasks, onStatusChange, onDelete }) {
  const statusConfig = {
    pending: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock,
    },
    'in-progress': {
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: RotateCw,
    },
    completed: {
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
    },
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const StatusIcon = statusConfig[task.status].icon;
        const isOverdue = task.dueDate && new Date() > new Date(task.dueDate) && task.status !== 'completed';
        
        return (
          <div key={task.id} className="bg-white p-6 rounded-xl shadow-lg transition duration-150 ease-in-out hover:shadow-xl">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                <p className="mt-2 text-gray-600">{task.description}</p>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="relative">
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task.id, e.target.value)}
                      className={`appearance-none ${
                        statusConfig[task.status].color
                      } pl-8 pr-10 py-2 rounded-full text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <StatusIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                  {task.dueDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                        {isOverdue && ' (Overdue)'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => onDelete(task.id)}
                className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition duration-150 ease-in-out"
                title="Delete task"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        );
      })}
      {tasks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <p className="text-gray-500">No tasks yet. Add your first task above!</p>
        </div>
      )}
    </div>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['pending', 'in-progress', 'completed']).isRequired,
      createdAt: PropTypes.instanceOf(Date).isRequired,
      dueDate: PropTypes.instanceOf(Date),
    })
  ).isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};