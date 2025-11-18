import z from 'zod';

const ZCreateProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name is too long'),
  status: z.enum(['In Progress', 'Completed']).optional(),
});

const ZUpdateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  status: z.enum(['In Progress', 'Completed']).optional(),
  progress: z.number().min(0).max(100).optional(),
});

const ZCreateTaskSchema = z.object({
  name: z
    .string()
    .min(1, 'Task name is required')
    .max(200, 'Task name is too long'),
  teamMemberId: z.string().nullable().optional(),
});

const ZUpdateTaskSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  isComplete: z.boolean().optional(),
  teamMemberId: z.string().nullable().optional(),
});

const ZCreateTeamMemberSchema = z.object({
  name: z
    .string()
    .min(1, 'Team member name is required')
    .max(100, 'Name is too long'),
});

export {
  ZCreateProjectSchema,
  ZUpdateProjectSchema,
  ZCreateTaskSchema,
  ZUpdateTaskSchema,
  ZCreateTeamMemberSchema,
};
