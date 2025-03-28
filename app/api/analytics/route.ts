import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's workspace ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { workspaces: true }
    });

    if (!user?.workspaces[0]?.id) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
    }

    const workspaceId = user.workspaces[0].id;

    // Get tasks for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTasks = await prisma.task.findMany({
      where: {
        workspaceId,
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      select: {
        createdAt: true,
        status: true
      }
    });

    // Process monthly stats
    const monthlyStats = processMonthlyStats(monthlyTasks);

    // Get weekly tasks
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyTasks = await prisma.task.findMany({
      where: {
        workspaceId,
        createdAt: {
          gte: weekAgo
        }
      },
      select: {
        createdAt: true,
        status: true
      }
    });

    // Process weekly stats
    const weeklyStats = processWeeklyStats(weeklyTasks);

    // Get task distribution
    const taskDistribution = await getTaskDistribution(workspaceId);

    // Calculate metrics
    const metrics = await calculateMetrics(workspaceId);

    return NextResponse.json({
      monthlyStats,
      weeklyStats,
      taskDistribution,
      metrics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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

async function getTaskDistribution(workspaceId: string) {
  const statuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
  const counts = await Promise.all(
    statuses.map(status =>
      prisma.task.count({
        where: {
          workspaceId,
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

async function calculateMetrics(workspaceId: string) {
  // Get total tasks
  const totalTasks = await prisma.task.count({
    where: { workspaceId }
  });

  // Get completed tasks
  const completedTasks = await prisma.task.count({
    where: {
      workspaceId,
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
      workspaceId,
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
      workspaceId,
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