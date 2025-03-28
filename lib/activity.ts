import prisma from './prisma';

type ActivityType = 'CREATE' | 'UPDATE' | 'COMPLETE' | 'DELETE';

export async function createActivity(
  userId: string,
  type: ActivityType,
  description: string
) {
  try {
    const activity = await prisma.activity.create({
      data: {
        userId,
        type,
        description,
      },
    });
    return activity;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
} 