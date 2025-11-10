# VZNX Challenge - Project Management Platform

A minimal, functional prototype for architecture studios to manage projects and teams.

## 🎯 Project Overview

This application provides three core features:

1. **Project Dashboard** - Manage projects with progress tracking
2. **Task Management** - Create and track tasks within projects
3. **Team Overview** - Monitor team workload and capacity

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui (built on Radix UI)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 📋 Features Implemented

### ✅ Project Dashboard

- View all projects in a card-based layout
- **Add new projects** with automatic "In Progress" status
- **Edit project progress** manually (0-100%)
- **Delete projects** with confirmation
- Display project status, progress bar, and task counts
- **Bonus**: Auto-update project progress when all tasks are complete

### ✅ Task List (Inside Each Project)

- Click on any project to view its tasks
- **Add tasks** with optional team member assignment
- **Toggle task completion** with visual feedback (checkbox + strikethrough)
- Task completion automatically updates parent project progress
- Delete tasks with automatic progress recalculation
- Clean UI with completed tasks visually distinguished

### ✅ Team Overview

- Display all team members with their assigned tasks
- Show **task count** for each member
- **Capacity bar** visualization (5 tasks = 100% capacity)
- **Color-coded workload levels**:
  - 🟢 Green (0-2 tasks): Light Load
  - 🟠 Orange (3-4 tasks): Moderate Load
  - 🔴 Red (5+ tasks): At Capacity
- Add new team members
- View active tasks per team member

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Neon database account (or PostgreSQL database)

### Step-by-Step Setup

#### 1. **Database Configuration**

You need to set up a Neon database:

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy your connection string
4. Update `.env` file with your database URL:
   ```env
   DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
   ```

#### 2. **Install Dependencies**

```bash
npm install
```

#### 3. **Initialize Database**

```bash
npx prisma generate
npx prisma migrate dev --name init
```

#### 4. **Run the Development Server**

```bash
npm run dev
```

The app will be available at:

- Primary: http://localhost:3000
- Alternative: http://localhost:3001 (if 3000 is in use)

## 🗄️ Database Schema

### Models

**Project**

- `id`: Unique identifier
- `name`: Project name
- `status`: "In Progress" or "Completed"
- `progress`: 0-100 percentage
- `tasks`: Related tasks

**Task**

- `id`: Unique identifier
- `name`: Task name
- `isComplete`: Boolean status
- `projectId`: Foreign key to Project
- `teamMemberId`: Optional foreign key to TeamMember

**TeamMember**

- `id`: Unique identifier
- `name`: Member name
- `tasks`: Related tasks

## 🎨 Key Features Explained

### Auto-Progress Calculation

When you toggle a task's completion status, the system:

1. Counts total tasks in the project
2. Counts completed tasks
3. Calculates percentage: `(completed / total) × 100`
4. Updates the project's progress automatically
5. Sets status to "Completed" if progress reaches 100%

### Capacity Visualization

The team page shows workload using a simple formula:

- **Capacity**: `(task_count / 5) × 100%`
- **Color Logic**:
  - Green: 0-2 tasks (healthy workload)
  - Orange: 3-4 tasks (moderate workload)
  - Red: 5+ tasks (at or over capacity)

## 🔧 API Endpoints

### Projects

- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get single project
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Tasks

- `GET /api/projects/[id]/tasks` - List project tasks
- `POST /api/projects/[id]/tasks` - Create task
- `PATCH /api/tasks/[taskId]` - Update task (toggle, assign)
- `DELETE /api/tasks/[taskId]` - Delete task

### Team

- `GET /api/team` - List all team members
- `POST /api/team` - Create team member

## 🎯 Usage Guide

### Creating Your First Project

1. Click "New Project" on the dashboard
2. Enter a project name
3. The project is created with 0% progress

### Adding Tasks

1. Click "View Tasks" on any project card
2. Click "Add Task" button
3. Enter task name
4. Optionally assign to a team member
5. Task appears in the list

### Completing Tasks

1. Click the checkbox next to any task
2. Task gets strikethrough styling
3. Project progress updates automatically
4. Status changes to "Completed" when all tasks are done

### Managing Team

1. Navigate to "Team" page
2. Click "Add Team Member"
3. View workload distribution
4. Assign tasks when creating them in projects

## 🎨 Design Choices

- **Minimal UI**: Clean, card-based design for clarity
- **Visual Feedback**: Color-coded status, progress bars, checkboxes
- **Auto-Updates**: Progress calculated automatically from task completion
- **Responsive**: Works on desktop and mobile devices
- **Type-Safe**: Full TypeScript for reliability

## 🚧 Future Enhancements

Potential improvements:

- Drag-and-drop task reordering
- Due dates and deadlines
- Task priorities
- Team member capacity limits
- Project filtering and search
- Dark mode toggle
- Real-time updates with WebSockets
- Analytics dashboard

## 📝 Development Notes

- Uses Next.js App Router for modern React patterns
- Server components for data fetching
- Client components for interactivity
- Prisma for type-safe database access
- shadcn/ui for consistent, accessible components

## 🐛 Troubleshooting

**Database Connection Issues**

- Verify your `.env` DATABASE_URL is correct
- Ensure Neon database is active
- Run `npx prisma db push` to sync schema

**Port Already in Use**

- The app automatically uses port 3001 if 3000 is busy
- Or manually specify: `npm run dev -- -p 3002`

**Prisma Generate Errors**

- Run `npx prisma generate` after schema changes
- Delete `node_modules/.prisma` and regenerate


Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
#
