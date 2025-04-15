import React from 'react';
import PropTypes from 'prop-types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { PieChartIcon, BarChart3 } from 'lucide-react';

export function Dashboard({ tasks }) {
  const statusConfig = {
    pending: {
      color: '#FCD34D',
      label: 'Pending',
    },
    'in-progress': {
      color: '#60A5FA',
      label: 'In Progress',
    },
    completed: {
      color: '#34D399',
      label: 'Completed',
    },
  };

  const statusCount = tasks.reduce(
    (acc, task) => {
      acc[task.status]++;
      return acc;
    },
    { pending: 0, 'in-progress': 0, completed: 0 }
  );

  const total = tasks.length;
  const percentages = {
    pending: total ? ((statusCount.pending / total) * 100).toFixed(1) : 0,
    'in-progress': total ? ((statusCount['in-progress'] / total) * 100).toFixed(1) : 0,
    completed: total ? ((statusCount.completed / total) * 100).toFixed(1) : 0,
  };

  const pieData = [
    { name: 'Pending', value: statusCount.pending, color: statusConfig.pending.color },
    { name: 'In Progress', value: statusCount['in-progress'], color: statusConfig['in-progress'].color },
    { name: 'Completed', value: statusCount.completed, color: statusConfig.completed.color },
  ];

  const barData = [
    { name: 'Pending', value: Number(percentages.pending), color: statusConfig.pending.color },
    { name: 'In Progress', value: Number(percentages['in-progress']), color: statusConfig['in-progress'].color },
    { name: 'Completed', value: Number(percentages.completed), color: statusConfig.completed.color },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center mb-6">
          <PieChartIcon className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold">Task Distribution</h2>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          {pieData.map((item) => (
            <div
              key={item.name}
              className="text-center p-4 rounded-xl"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <div className="text-2xl font-bold" style={{ color: item.color }}>
                {item.value}
              </div>
              <div className="text-gray-600 font-medium">{item.name}</div>
              <div className="text-sm text-gray-500">
                {total ? ((item.value / total) * 100).toFixed(1) : 0}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center mb-6">
          <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold">Task Completion Rate</h2>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} unit="%" />
              <Tooltip />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
              >
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

Dashboard.propTypes = {
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
};