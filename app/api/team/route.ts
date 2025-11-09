import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ZCreateTeamMemberSchema } from '@/lib/validations';
import { z } from 'zod';

// GET all team members with their task counts
export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      include: {
        tasks: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// POST create a new team member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = ZCreateTeamMemberSchema.parse(body);

    const teamMember = await prisma.teamMember.create({
      data: {
        name: validatedData.name,
      },
      include: {
        tasks: true,
      },
    });

    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}
