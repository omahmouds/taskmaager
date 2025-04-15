import React from 'react';
import PropTypes from 'prop-types';
import { FileText, Clock, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function TaskReport({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;

  const averageCompletionRate = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

  const completedTasksWithDuration = tasks
    .filter(task => task.status === 'completed')
    .map(task => {
      const duration = new Date() - new Date(task.createdAt);
      return duration / (1000 * 60 * 60 * 24); // Convert to days
    });

  const averageCompletionTime = completedTasksWithDuration.length
    ? (completedTasksWithDuration.reduce((a, b) => a + b, 0) / completedTasksWithDuration.length).toFixed(1)
    : 0;

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Task Manager Report', 20, 20);
    
    // Add summary statistics
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Total Tasks: ${totalTasks}`, 20, 40);
    doc.text(`Completion Rate: ${averageCompletionRate}%`, 20, 50);
    doc.text(`Average Completion Time: ${averageCompletionTime} days`, 20, 60);
    
    // Add tasks table
    const tableData = tasks.map(task => [
      task.title,
      task.status,
      new Date(task.createdAt).toLocaleDateString(),
      task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'
    ]);

    doc.autoTable({
      startY: 70,
      head: [['Task', 'Status', 'Created', 'Due Date']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] }
    });

    doc.save('task-report.pdf');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold">Task Report</h2>
        </div>
        <button
          onClick={downloadPDF}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out"
        >
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
          <div className="text-sm text-gray-600">Completed Tasks</div>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{pendingTasks}</div>
          <div className="text-sm text-gray-600">Pending Tasks</div>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600">{inProgressTasks}</div>
          <div className="text-sm text-gray-600">In Progress Tasks</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-gray-600">Completion Rate</span>
          </div>
          <span className="text-lg font-semibold text-gray-800">{averageCompletionRate}%</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-gray-600">Avg. Completion Time</span>
          </div>
          <span className="text-lg font-semibold text-gray-800">
            {averageCompletionTime} days
          </span>
        </div>
      </div>
    </div>
  );
}

TaskReport.propTypes = {
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