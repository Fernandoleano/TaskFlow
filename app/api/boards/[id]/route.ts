import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createActivity } from '@/lib/activity';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const board = await prisma.board.findFirst({
      where: {
        id: params.id,
        users: {
          some: {
            id: session.user.id
          }
        }
      },
      include: {
        tasks: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }

    return NextResponse.json(board);
  } catch (error) {
    console.error('Error fetching board:', error);
    return NextResponse.json({ error: 'Failed to fetch board' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description } = await request.json();

    const board = await prisma.board.findFirst({
      where: {
        id: params.id,
        users: {
          some: {
            id: session.user.id
          }
        }
      }
    });

    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }

    const updatedBoard = await prisma.board.update({
      where: { id: params.id },
      data: {
        title,
        description
      }
    });

    // Create activity for board update
    await createActivity(
      session.user.id,
      'UPDATE',
      `Updated board: ${title}`
    );

    return NextResponse.json(updatedBoard);
  } catch (error) {
    console.error('Error updating board:', error);
    return NextResponse.json({ error: 'Failed to update board' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const board = await prisma.board.findFirst({
      where: {
        id: params.id,
        users: {
          some: {
            id: session.user.id
          }
        }
      }
    });

    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }

    await prisma.board.delete({
      where: { id: params.id }
    });

    // Create activity for board deletion
    await createActivity(
      session.user.id,
      'DELETE',
      `Deleted board: ${board.title}`
    );

    return NextResponse.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Error deleting board:', error);
    return NextResponse.json({ error: 'Failed to delete board' }, { status: 500 });
  }
} 