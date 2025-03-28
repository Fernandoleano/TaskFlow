'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const generateRandomData = (min: number, max: number, count: number) => {
  return Array.from({ length: count }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Task Completion Rate',
      data: [65, 78, 85, 92, 88, 95],
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.4,
      fill: true,
    },
  ],
};

const barData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    {
      label: 'Tasks Completed',
      data: [12, 19, 15, 17, 14],
      backgroundColor: 'rgba(147, 51, 234, 0.5)',
      borderColor: 'rgb(147, 51, 234)',
      borderWidth: 1,
    },
  ],
};

const doughnutData = {
  labels: ['Completed', 'In Progress', 'Pending'],
  datasets: [
    {
      data: [63, 25, 12],
      backgroundColor: [
        'rgba(52, 211, 153, 0.8)',
        'rgba(99, 102, 241, 0.8)',
        'rgba(251, 113, 133, 0.8)',
      ],
      borderColor: [
        'rgb(52, 211, 153)',
        'rgb(99, 102, 241)',
        'rgb(251, 113, 133)',
      ],
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: {
        display: false,
      },
      ticks: {
        display: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#6B7280',
      },
    },
  },
};

const reviews = [
  {
    name: 'Sarah Johnson',
    role: 'Project Manager at TechCorp',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    content: "TaskFlow has transformed how our team manages projects. The analytics and insights are invaluable.",
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Team Lead at DesignCo',
    image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    content: "The best task management tool I've used. Simple yet powerful, perfect for our creative team.",
    rating: 5,
  },
  {
    name: 'Emma Davis',
    role: 'Product Manager at StartupX',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    content: "TaskFlow's analytics have helped us make data-driven decisions. Highly recommended!",
    rating: 5,
  },
];

const trustedBy = [
  { name: 'Google', logo: '/logos/google.svg' },
  { name: 'Microsoft', logo: '/logos/microsoft.svg' },
  { name: 'Amazon', logo: '/logos/amazon.svg' },
  { name: 'Meta', logo: '/logos/meta.svg' },
];

export default function Home() {
  const { data: session } = useSession();
  const [activeChart, setActiveChart] = useState('line');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackData, setPlaybackData] = useState(chartData.datasets[0].data);
  const [playbackSpeed, setPlaybackSpeed] = useState(2000);
  const [dataRange, setDataRange] = useState({ min: 60, max: 100 });
  const [customData, setCustomData] = useState(chartData.datasets[0].data);
  const [isCustomMode, setIsCustomMode] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isPlaying && !isCustomMode) {
      // Update immediately when starting
      setPlaybackData(generateRandomData(dataRange.min, dataRange.max, 6));
      
      // Set up the interval for subsequent updates
      intervalId = setInterval(() => {
        setPlaybackData(generateRandomData(dataRange.min, dataRange.max, 6));
      }, playbackSpeed);
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, playbackSpeed, dataRange, isCustomMode]);

  const togglePlayback = () => {
    if (isCustomMode) {
      setIsCustomMode(false);
    }
    setIsPlaying(!isPlaying);
  };

  const handleDataPointChange = (index: number, value: number) => {
    const newData = [...customData];
    newData[index] = Math.max(0, Math.min(100, value));
    setCustomData(newData);
  };

  const toggleCustomMode = () => {
    setIsPlaying(false);
    setIsCustomMode(!isCustomMode);
    if (!isCustomMode) {
      setCustomData([...playbackData]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-blue-400/30 via-indigo-500/30 to-purple-600/30 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-purple-400/30 via-pink-500/30 to-rose-500/30 blur-3xl animate-pulse-slower" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-indigo-500/30 blur-3xl animate-pulse-slow delay-1000" />
        
        {/* Secondary Gradient Orbs */}
        <div className="absolute top-2/3 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-violet-400/20 via-purple-500/20 to-fuchsia-500/20 blur-2xl animate-pulse-slower delay-700" />
        <div className="absolute top-1/4 right-1/3 w-[250px] h-[250px] rounded-full bg-gradient-to-tr from-emerald-400/20 via-teal-500/20 to-cyan-500/20 blur-2xl animate-pulse-slow delay-1500" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-[20%] w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/20 animate-float-slow rotate-12" />
        <div className="absolute top-40 right-[30%] w-20 h-20 rounded-[1.5rem] bg-gradient-to-tr from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/20 animate-float-delay -rotate-12" />
        <div className="absolute bottom-32 left-[40%] w-28 h-28 rounded-[2.5rem] bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/20 animate-float rotate-45" />
        
        {/* Small Decorative Elements */}
        <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-blue-400/30 animate-ping delay-300" />
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 rounded-full bg-purple-400/30 animate-ping delay-700" />
        <div className="absolute top-2/3 right-1/3 w-2 h-2 rounded-full bg-pink-400/30 animate-ping delay-1000" />
      </div>

      {/* Add these styles to your global CSS or create a new style tag */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-15px) rotate(-8deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-25px) rotate(15deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
        .animate-float {
          animation: float 12s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 15s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 18s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 15s ease-in-out infinite;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
        .delay-1500 {
          animation-delay: 1500ms;
        }
      `}</style>

      {/* Navigation */}
      <nav className="relative bg-white/70 backdrop-blur-lg shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-bold text-xl">T</span>
              </motion.div>
              <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                TaskFlow
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <Link
                  href="/dashboard"
                  className="relative group px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Go to Dashboard</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors px-4 py-2 hover:bg-gray-50 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="relative group px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative inline-block"
          >
            <h1 className="text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 leading-tight">
              Manage Tasks with Ease
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-10 blur-2xl" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Powerful task management made simple.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center space-x-6"
          >
            {!session && (
              <>
                <Link
                  href="/auth/signup"
                  className="relative group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Start for Free</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  href="/auth/signin"
                  className="px-8 py-4 rounded-xl bg-white text-gray-900 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border border-gray-100"
                >
                  Sign In
                </Link>
              </>
            )}
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, translateY: -10 }}
            className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Task Management</h3>
            <p className="text-gray-600 leading-relaxed">Create, organize, and track tasks with our intuitive interface. Stay on top of your projects with ease.</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, translateY: -10 }}
            className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Team Collaboration</h3>
            <p className="text-gray-600 leading-relaxed">Work together seamlessly with real-time updates and powerful team features.</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, translateY: -10 }}
            className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Analytics & Insights</h3>
            <p className="text-gray-600 leading-relaxed">Track progress and get powerful insights with advanced analytics tools.</p>
          </motion.div>
        </motion.div>

        {/* Analytics Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-24 bg-white/50 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Performance Analytics</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleCustomMode}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isCustomMode
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Custom Mode
              </button>
              <button
                onClick={togglePlayback}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg transition-all"
              >
                {isPlaying ? 'Stop' : 'Play Live'}
              </button>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveChart('line')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    activeChart === 'line'
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Trends
                </button>
                <button
                  onClick={() => setActiveChart('bar')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    activeChart === 'bar'
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setActiveChart('doughnut')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    activeChart === 'doughnut'
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="h-[300px]">
                {activeChart === 'line' && (
                  <Line
                    data={{
                      ...chartData,
                      datasets: [{
                        ...chartData.datasets[0],
                        data: isCustomMode ? customData : (isPlaying ? playbackData : chartData.datasets[0].data),
                      }],
                    }}
                    options={chartOptions}
                  />
                )}
                {activeChart === 'bar' && (
                  <Bar
                    data={barData}
                    options={{
                      ...chartOptions,
                      scales: {
                        ...chartOptions.scales,
                        y: {
                          ...chartOptions.scales.y,
                          max: 20,
                        },
                      },
                    }}
                  />
                )}
                {activeChart === 'doughnut' && (
                  <Doughnut
                    data={doughnutData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: true,
                          position: 'bottom' as const,
                        },
                      },
                    }}
                  />
                )}
              </div>

              {/* Playback Controls */}
              {activeChart === 'line' && !isCustomMode && (
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Playback Controls</h3>
                  <div>
                    <label className="text-sm text-gray-600">Update Speed (ms)</label>
                    <input
                      type="range"
                      min="500"
                      max="5000"
                      step="500"
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Fast (0.5s)</span>
                      <span>Slow (5s)</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Data Range</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={dataRange.min}
                        onChange={(e) => setDataRange({ ...dataRange, min: Number(e.target.value) })}
                        className="w-20 px-3 py-2 border border-gray-200 rounded-lg"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={dataRange.max}
                        onChange={(e) => setDataRange({ ...dataRange, max: Number(e.target.value) })}
                        className="w-20 px-3 py-2 border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Data Controls */}
              {activeChart === 'line' && isCustomMode && (
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Custom Data</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {customData.map((value, index) => (
                      <div key={index}>
                        <label className="text-sm text-gray-600">{chartData.labels[index]}</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={value}
                          onChange={(e) => handleDataPointChange(index, Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Task Completion Rate</span>
                    <span className="text-gray-900 font-medium">95%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 w-[95%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Team Productivity</span>
                    <span className="text-gray-900 font-medium">87%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 w-[87%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Project Progress</span>
                    <span className="text-gray-900 font-medium">78%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 w-[78%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trusted By Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-24"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Trusted by Industry Leaders</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {trustedBy.map((company) => (
              <motion.div
                key={company.name}
                whileHover={{ scale: 1.05, translateY: -5 }}
                className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-gray-100"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className={`${
                    company.name === 'Amazon' ? 'h-12' : 'h-8'
                  } w-auto opacity-70 hover:opacity-100 transition-all duration-300`}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-24 mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <motion.div
                key={review.name}
                whileHover={{ scale: 1.05, translateY: -10 }}
                className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-14 h-14 rounded-full ring-4 ring-purple-50"
                  />
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900 text-lg">{review.name}</h3>
                    <p className="text-sm text-gray-500">{review.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed">{review.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
} 