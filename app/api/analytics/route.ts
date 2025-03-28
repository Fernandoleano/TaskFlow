import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's tasks for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const tasks = await prisma.task.findMany({
      where: {
        user: {
          email: session.user.email
        },
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        completedAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Process data for charts
    const monthlyStats = processMonthlyStats(tasks);
    const weeklyStats = processWeeklyStats(tasks);
    const taskDistribution = processTaskDistribution(tasks);
    const keyMetrics = calculateKeyMetrics(tasks);

    return NextResponse.json({
      monthlyStats,
      weeklyStats,
      taskDistribution,
      keyMetrics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function processMonthlyStats(tasks: any[]) {
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toLocaleString('default', { month: 'short' });
  }).reverse();

  const data = Array(6).fill(0);
  tasks.forEach(task => {
    const monthIndex = 5 - Math.floor(
      (new Date().getTime() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    if (monthIndex >= 0 && monthIndex < 6) {
      data[monthIndex]++;
    }
  });

  return {
    labels: months,
    data
  };
}

function processWeeklyStats(tasks: any[]) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleString('default', { weekday: 'short' });
  }).reverse();

  const data = Array(7).fill(0);
  tasks.forEach(task => {
    const dayIndex = 6 - Math.floor(
      (new Date().getTime() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (dayIndex >= 0 && dayIndex < 7) {
      data[dayIndex]++;
    }
  });

  return {
    labels: days,
    data
  };
}

async function processTaskDistribution(tasks: any[]) {
  const statuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
  const counts = await Promise.all(
    statuses.map(status =>
      prisma.task.count({
        where: {
          workspaceId: tasks[0].workspaceId,
          status
        }
      })
    )
  );

  return {
    labels: ['To Do', 'In Progress', 'Completed'],
    data: counts
  };
}

async function calculateKeyMetrics(tasks: any[]) {
  // Get total tasks
  const totalTasks = await prisma.task.count({
    where: { workspaceId: tasks[0].workspaceId }
  });

  // Get completed tasks
  const completedTasks = await prisma.task.count({
    where: {
      workspaceId: tasks[0].workspaceId,
      status: 'COMPLETED'
    }
  });

  // Calculate completion rate
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Calculate productivity rate (tasks completed per day over the last week)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const recentCompletedTasks = await prisma.task.count({
    where: {
      workspaceId: tasks[0].workspaceId,
      status: 'COMPLETED',
      completedAt: {
        gte: weekAgo
      }
    }
  });
  const productivityRate = (recentCompletedTasks / 7) * 100;

  // Calculate project progress (assuming each task has equal weight)
  const inProgressTasks = await prisma.task.count({
    where: {
      workspaceId: tasks[0].workspaceId,
      status: 'IN_PROGRESS'
    }
  });
  const projectProgress = totalTasks > 0
    ? ((completedTasks + (inProgressTasks * 0.5)) / totalTasks) * 100
    : 0;

  return {
    completionRate,
    productivityRate,
    projectProgress
  };
} 