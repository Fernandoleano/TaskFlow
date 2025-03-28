'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

interface ChartData {
  name: string;
  value?: number;
  completed?: number;
  created?: number;
  tasks?: number;
  progress?: number;
}

interface ChartsProps {
  taskCompletionData: ChartData[];
  taskDistributionData: ChartData[];
  teamPerformanceData: ChartData[];
  projectProgressData: ChartData[];
}

export default function Charts({
  taskCompletionData,
  taskDistributionData,
  teamPerformanceData,
  projectProgressData
}: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Task Completion Trend */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Task Completion Trend</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={taskCompletionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#3b82f6" />
              <Line type="monotone" dataKey="created" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Task Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Task Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={taskDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {taskDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Performance */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Team Performance</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teamPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks" fill="#3b82f6" />
              <Bar dataKey="completed" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Progress */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Project Progress</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="progress" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 