import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createActivity } from '@/lib/activity';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, workspaceId, boardId, priority = 'MEDIUM', dueDate } = await request.json();

    if (!title || !workspaceId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify workspace exists and user has access
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        users: {
          some: {
            id: session.user.id
          }
        }
      }
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found or access denied' }, { status: 404 });
    }

    // If boardId is provided, verify board exists and user has access
    if (boardId) {
      const board = await prisma.board.findFirst({
        where: {
          id: boardId,
          users: {
            some: {
              id: session.user.id
            }
          }
        }
      });

      if (!board) {
        return NextResponse.json({ error: 'Board not found or access denied' }, { status: 404 });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate,
        workspaceId,
        boardId,
        userId: session.user.id
      }
    });

    // Create activity for task creation
    await createActivity(
      session.user.id,
      'CREATE',
      `Created task: ${title}${boardId ? ` in board` : ''}`
    );

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status, title } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    // Verify task exists and user has access
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found or access denied' }, { status: 404 });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        status,
        completedAt: status === 'COMPLETED' ? new Date() : null
      }
    });

    // Create activity for task update
    await createActivity(
      session.user.id,
      status === 'COMPLETED' ? 'COMPLETE' : 'UPDATE',
      status === 'COMPLETED' ? `Completed task: ${title}` : `Updated task: ${title}`
    );

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const title = searchParams.get('title');

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    // Verify task exists and user has access
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found or access denied' }, { status: 404 });
    }

    await prisma.task.delete({
      where: { id }
    });

    // Create activity for task deletion
    await createActivity(
      session.user.id,
      'DELETE',
      `Deleted task: ${title}`
    );

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
} 