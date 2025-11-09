import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ZUpdateTaskSchema } from '@/lib/validations';
import { z } from 'zod';

// PATCH update a task (toggle completion, change assignment)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const body = await request.json();

    const validatedData = ZUpdateTaskSchema.parse(body);

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(validatedData.isComplete !== undefined && {
          isComplete: validatedData.isComplete,
        }),
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.teamMemberId !== undefined && {
          teamMemberId: validatedData.teamMemberId,
        }),
      },
      include: {
        teamMember: true,
        project: true,
      },
    });

    // Auto-update project progress if task completion changed
    if (validatedData.isComplete !== undefined) {
      const allTasks = await prisma.task.findMany({
        where: { projectId: task.projectId },
      });

      const completedTasks = allTasks.filter((t) => t.isComplete).length;
      const totalTasks = allTasks.length;
      const progress =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      await prisma.project.update({
        where: { id: task.projectId },
        data: {
          progress,
          status: progress === 100 ? 'Completed' : 'In Progress',
        },
      });
    }

    return NextResponse.json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    // Update project progress after deleting task
    const allTasks = await prisma.task.findMany({
      where: { projectId: task.projectId },
    });

    const completedTasks = allTasks.filter((t) => t.isComplete).length;
    const totalTasks = allTasks.length;
    const progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    await prisma.project.update({
      where: { id: task.projectId },
      data: {
        progress,
        status: progress === 100 ? 'Completed' : 'In Progress',
      },
    });

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
