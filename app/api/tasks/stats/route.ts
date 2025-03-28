import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const [total, completed, inProgress, todo] = await Promise.all([
      prisma.task.count({
        where: { userId }
      }),
      prisma.task.count({
        where: { userId, status: 'COMPLETED' }
      }),
      prisma.task.count({
        where: { userId, status: 'IN_PROGRESS' }
      }),
      prisma.task.count({
        where: { userId, status: 'TODO' }
      })
    ]);

    return NextResponse.json({
      total,
      completed,
      inProgress,
      todo
    });
  } catch (error) {
    console.error('Error fetching task stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task statistics' },
      { status: 500 }
    );
  }
} 