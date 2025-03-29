'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
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
  Filler,
} from 'chart.js';
import { useRef } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const generateRandomData = (min: number, max: number, count: number) => {
  return Array.from({ length: count }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    label: 'Task Completion',
    data: [65, 59, 80, 81, 56, 55, 40],
    fill: true,
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    tension: 0.4,
  }],
};

const barData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    label: 'Tasks Completed',
    data: [12, 15, 8, 10, 14, 9, 11],
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    borderRadius: 8,
  }],
};

const doughnutData = {
  labels: ['Completed', 'In Progress', 'Pending'],
  datasets: [{
    data: [65, 25, 10],
    backgroundColor: [
      'rgba(139, 92, 246, 0.8)',
      'rgba(99, 102, 241, 0.8)',
      'rgba(67, 56, 202, 0.8)',
    ],
    borderWidth: 0,
  }],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: 'rgba(255, 255, 255, 0.7)',
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
      },
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
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

const AnimatedCounter = ({ end, duration = 3.5, label }: { end: number; duration?: number; label: string }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const isInView = useInView(counterRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationFrame: number;

      const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        const easedProgress = easeOutQuart(progress);

        setCount(Math.floor(easedProgress * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [end, duration, isInView]);

  return (
    <div ref={counterRef} className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400"
      >
        {count.toLocaleString()}+
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-2 text-lg text-white/70"
      >
        {label}
      </motion.div>
    </div>
  );
};

export default function Home() {
  const { data: session } = useSession();
  const [activeChart, setActiveChart] = useState('line');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackData, setPlaybackData] = useState([65, 59, 80, 81, 56, 55, 40]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [dataRange, setDataRange] = useState({ min: 0, max: 100 });
  const [customData, setCustomData] = useState([65, 59, 80, 81, 56, 55, 40]);
  const [isCustomMode, setIsCustomMode] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackData(prev => {
          const newData = [...prev];
          const randomChange = Math.random() * 20 - 10;
          newData.push(Math.max(dataRange.min, Math.min(dataRange.max, newData[newData.length - 1] + randomChange)));
          return newData.slice(-7);
        });
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, dataRange]);

  const togglePlayback = () => {
    if (isCustomMode) {
      setIsCustomMode(false);
    }
    setIsPlaying(!isPlaying);
  };

  const handleDataPointChange = (index: number, value: number) => {
    const newData = [...customData];
    newData[index] = value;
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
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-violet-600/30 via-indigo-600/30 to-blue-600/30 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-fuchsia-600/30 via-violet-600/30 to-indigo-600/30 blur-3xl animate-pulse-slower" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-600/30 via-blue-600/30 to-indigo-600/30 blur-3xl animate-pulse-slow delay-1000" />
        
        {/* Secondary Gradient Orbs */}
        <div className="absolute top-2/3 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 blur-2xl animate-pulse-slower delay-700" />
        <div className="absolute top-1/4 right-1/3 w-[250px] h-[250px] rounded-full bg-gradient-to-tr from-emerald-600/20 via-teal-600/20 to-cyan-600/20 blur-2xl animate-pulse-slow delay-1500" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-[20%] w-24 h-24 rounded-[2rem] bg-gradient-to-br from-violet-600/10 to-indigo-600/10 backdrop-blur-sm border border-white/10 animate-float-slow rotate-12" />
        <div className="absolute top-40 right-[30%] w-20 h-20 rounded-[1.5rem] bg-gradient-to-tr from-fuchsia-600/10 to-violet-600/10 backdrop-blur-sm border border-white/10 animate-float-delay -rotate-12" />
        <div className="absolute bottom-32 left-[40%] w-28 h-28 rounded-[2.5rem] bg-gradient-to-r from-indigo-600/10 to-cyan-600/10 backdrop-blur-sm border border-white/10 animate-float rotate-45" />
      </div>

      {/* Navigation */}
      <nav className="relative backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25"
              >
                <span className="text-white font-bold text-xl">T</span>
              </motion.div>
              <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
                TaskFlow
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {session ? (
                <Link
                  href="/dashboard"
                  className="relative group px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Go to Dashboard</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="px-6 py-2.5 rounded-xl bg-white/5 text-white font-semibold transition-all duration-300 hover:bg-white/10 border border-white/10"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="relative group px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center relative mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block"
        >
          <h1 className="text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400 leading-tight">
            Manage Tasks with Ease
          </h1>
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl opacity-10 blur-2xl" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed"
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
                className="relative group px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="relative z-10">Start for Free</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/auth/signin"
                className="px-8 py-4 rounded-xl bg-white/5 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border border-white/10 hover:bg-white/10"
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
        className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          whileHover={{ scale: 1.05, translateY: -10 }}
          className="backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/10 bg-white/5"
        >
          <div className="w-14 h-14 bg-violet-900/50 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-4">Task Management</h3>
          <p className="text-white/70 leading-relaxed">Create, organize, and track tasks with our intuitive interface. Stay on top of your projects with ease.</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, translateY: -10 }}
          className="backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/10 bg-white/5"
        >
          <div className="w-14 h-14 bg-indigo-900/50 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-4">Team Collaboration</h3>
          <p className="text-white/70 leading-relaxed">Work together seamlessly with real-time updates and powerful team features.</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, translateY: -10 }}
          className="backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/10 bg-white/5"
        >
          <div className="w-14 h-14 bg-fuchsia-900/50 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-4">Analytics & Insights</h3>
          <p className="text-white/70 leading-relaxed">Track progress and get powerful insights with advanced analytics tools.</p>
        </motion.div>
      </motion.div>

      {/* Analytics Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/10 bg-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Performance Analytics</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleCustomMode}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isCustomMode
                    ? 'bg-violet-900/50 text-violet-400'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                Custom Mode
              </button>
              <button
                onClick={togglePlayback}
                className="relative group px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="relative z-10">{isPlaying ? 'Stop' : 'Play Live'}</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <div className="flex bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setActiveChart('line')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    activeChart === 'line'
                      ? 'bg-violet-900/50 text-violet-400'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Trends
                </button>
                <button
                  onClick={() => setActiveChart('bar')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    activeChart === 'bar'
                      ? 'bg-violet-900/50 text-violet-400'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setActiveChart('doughnut')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    activeChart === 'doughnut'
                      ? 'bg-violet-900/50 text-violet-400'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Overview
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-2xl blur-lg" />
              <div className="relative backdrop-blur-lg rounded-xl border border-white/10 bg-white/5 p-6">
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
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: true,
                            position: 'bottom' as const,
                            labels: {
                              color: 'rgba(255, 255, 255, 0.7)',
                            },
                          },
                        },
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-2xl blur-lg" />
              <div className="relative backdrop-blur-lg rounded-xl border border-white/10 bg-white/5 p-6">
                {activeChart === 'line' && !isCustomMode && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Playback Controls</h3>
                    <div>
                      <label className="text-sm text-white/70">Update Speed (ms)</label>
                      <input
                        type="range"
                        min="500"
                        max="5000"
                        step="500"
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-white/50">
                        <span>Fast (0.5s)</span>
                        <span>Slow (5s)</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">Data Range</label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          min="0"
                          max="99"
                          value={dataRange.min}
                          onChange={(e) => setDataRange({ ...dataRange, min: Number(e.target.value) })}
                          className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                        />
                        <span className="text-white/50">to</span>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={dataRange.max}
                          onChange={(e) => setDataRange({ ...dataRange, max: Number(e.target.value) })}
                          className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeChart === 'line' && isCustomMode && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Custom Data</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {customData.map((value, index) => (
                        <div key={index}>
                          <label className="text-sm text-white/70">{chartData.labels[index]}</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={value}
                            onChange={(e) => handleDataPointChange(index, Number(e.target.value))}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeChart !== 'line' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Key Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">Task Completion Rate</span>
                          <span className="text-white">95%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 w-[95%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">Team Productivity</span>
                          <span className="text-white">87%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 w-[87%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">Project Progress</span>
                          <span className="text-white">78%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 w-[78%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Replace the Trusted By Section with Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="backdrop-blur-lg rounded-2xl shadow-xl p-12 border border-white/10 bg-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <AnimatedCounter end={50000} label="Active Users" />
            <AnimatedCounter end={1000000} label="Tasks Completed" />
            <AnimatedCounter end={5000} label="Teams Collaborating" />
          </div>
        </div>
      </motion.div>

      {/* Reviews Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="mt-24 mb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-3xl font-bold text-white mb-12 text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <motion.div
              key={review.name}
              whileHover={{ scale: 1.05, translateY: -10 }}
              className="backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/10 bg-white/5"
            >
              <div className="flex items-center mb-6">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-14 h-14 rounded-full ring-4 ring-violet-900/50"
                />
                <div className="ml-4">
                  <h3 className="font-bold text-white text-lg">{review.name}</h3>
                  <p className="text-sm text-white/50">{review.role}</p>
                </div>
              </div>
              <p className="text-white/70">{review.content}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 