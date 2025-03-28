import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's tasks
    const tasks = await prisma.task.findMany({
      where: {
        user: {
          email: session.user.email
        }
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        completedAt: true
      }
    });

    // Calculate stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length;
    const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS').length;
    const todoTasks = tasks.filter(task => task.status === 'TODO').length;

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const productivityRate = totalTasks > 0 ? ((completedTasks + inProgressTasks) / totalTasks) * 100 : 0;
    const projectProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return NextResponse.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      completionRate,
      productivityRate,
      projectProgress
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 