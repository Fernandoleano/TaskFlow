import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get the session
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

    // Get total tasks
    const totalTasks = await prisma.task.count({
      where: { workspaceId }
    });

    // Get team members count
    const teamMembers = await prisma.user.count({
      where: {
        workspaces: {
          some: { id: workspaceId }
        }
      }
    });

    // Get completed tasks for completion rate
    const completedTasks = await prisma.task.count({
      where: {
        workspaceId,
        status: 'COMPLETED'
      }
    });

    // Calculate completion rate
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Get average time per task (in hours)
    const tasks = await prisma.task.findMany({
      where: {
        workspaceId,
        status: 'COMPLETED',
        completedAt: { not: undefined },
        createdAt: { not: undefined }
      },
      select: {
        createdAt: true,
        completedAt: true
      }
    });

    let averageTime = 0;
    if (tasks.length > 0) {
      const totalHours = tasks.reduce((acc: number, task: { completedAt: Date | null; createdAt: Date }) => {
        if (task.completedAt) {
          const hours = (task.completedAt.getTime() - task.createdAt.getTime()) / (1000 * 60 * 60);
          return acc + hours;
        }
        return acc;
      }, 0);
      averageTime = totalHours / tasks.length;
    }

    return NextResponse.json({
      totalTasks,
      teamMembers,
      completionRate,
      averageTime
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 