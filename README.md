# VZNX Challenge - Project Management Platform

A minimal, functional prototype for architecture studios to manage projects and teams.

## 🎯 Project Overview

This application provides three core features:

1. **Project Dashboard** - Manage projects with progress tracking
2. **Task Management** - Create and track tasks within projects
3. **Team Overview** - Monitor team workload and capacity

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui (built on Radix UI)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript (CommonJS)
- **Validation**: Zod

### Database & DevOps

- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Containerization**: Docker & Docker Compose

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

- **Docker & Docker Compose** (Recommended) OR
- **Node.js 18+** and **PostgreSQL** (Manual setup)

---

## 💻 Manual Setup (Recommended for Development)

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Neon recommended)

### Step-by-Step Setup

#### 1. **Clone the Repository**

```bash
git clone https://github.com/Walaa-Volidis/vznx-challenge.git
cd vznx-challenge
```

#### 2. **Backend Setup**

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Update DATABASE_URL in .env with your PostgreSQL connection string

# Generate Prisma Client
npx prisma generate --schema=./src/prisma/schema.prisma

# Run database migrations
npx prisma migrate deploy --schema=./src/prisma/schema.prisma

# Start backend server (port 4000)
npm run dev
```

#### 3. **Frontend Setup** (in a new terminal)

```bash
cd frontend
npm install

# Start frontend development server (port 3000)
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

---

## 🐳 Quick Start with Docker (Recommended)

The easiest way to run the entire application with a database:

### 1. **Start the Application**

```bash
docker-compose up --build
```

This will:

- ✅ Start PostgreSQL database (port 5432)
- ✅ Build and start the backend API (port 4000)
- ✅ Build and start the frontend (port 3000)
- ✅ Run database migrations automatically
- ✅ Connect all services automatically

### 2. **Access the Application**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

### 2. **Access the Application**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

### 3. **Stop the Application**

```bash
# Stop containers
docker-compose down

# Stop and remove all data (fresh start)
docker-compose down -v
```

### 3. **View Logs**

```bash
# All logs
docker-compose logs -f

# Backend logs only
docker-compose logs -f backend

# Frontend logs only
docker-compose logs -f frontend
```

That's it! Your app is running at **http://localhost:3000** with the API at **http://localhost:4000** 🎉

---

## 💻 Environment Variables

### Backend (.env in backend/)

```env
PORT=4000
DATABASE_URL='postgresql://user:password@host:5432/database?sslmode=require'
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 💻 Manual Setup (Without Docker)

If you prefer to run without Docker, follow the manual setup instructions above in the "Getting Started" section.

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

All API endpoints are prefixed with `http://localhost:4000/api`

### Projects

- `GET /api/projects` - List all projects with task counts
- `POST /api/projects` - Create a new project
  - Body: `{ name: string, status?: 'In Progress' | 'Completed' }`
- `GET /api/projects/:id` - Get single project with tasks
- `PATCH /api/projects/:id` - Update project
  - Body: `{ name?: string, status?: string, progress?: number }`
- `DELETE /api/projects/:id` - Delete project

### Tasks

- `GET /api/projects/:id/tasks` - List all tasks for a project
- `POST /api/projects/:id/tasks` - Create a task in a project
  - Body: `{ name: string, teamMemberId?: string | null }`
- `PATCH /api/projects/tasks/:taskId` - Update a task
  - Body: `{ name?: string, isComplete?: boolean, teamMemberId?: string | null }`
- `DELETE /api/projects/tasks/:taskId` - Delete a task

### Team

- `GET /api/team` - List all team members with task counts
- `POST /api/team` - Create a new team member
  - Body: `{ name: string }`

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

### Architecture

- **Monorepo Structure**: Separate frontend and backend for clear separation of concerns
- **Layered Backend**: Controller → Service → Repository pattern for maintainability
- **REST API**: Simple, stateless API design
- **Type Safety**: TypeScript in frontend, Zod validation in backend

### UI/UX

- **Minimal UI**: Clean, card-based design for clarity
- **Visual Feedback**: Color-coded status, progress bars, checkboxes
- **Auto-Updates**: Progress calculated automatically from task completion
- **Responsive**: Works on desktop and mobile devices

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

### Backend

- Express.js with CommonJS modules
- Layered architecture (Controllers, Services, Repositories)
- Centralized error handling middleware
- Zod for request validation
- Prisma ORM for type-safe database access

### Frontend

- Next.js 16 App Router for modern React patterns
- Server components for data fetching
- Client components for interactivity
- Custom hooks for API integration
- shadcn/ui for consistent, accessible components

## 🐛 Troubleshooting

### Backend Issues

**Prisma Client Not Generated**

```bash
cd backend
npx prisma generate --schema=./src/prisma/schema.prisma
```

**Database Connection Issues**

- Verify your `.env` DATABASE_URL is correct
- Ensure PostgreSQL/Neon database is active
- Run `npx prisma migrate deploy --schema=./src/prisma/schema.prisma`

**Port 4000 Already in Use**

```bash
# Change PORT in backend/.env
PORT=4001
```

### Frontend Issues

**API Connection Failed**

- Ensure backend is running on port 4000
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify CORS settings in backend

**Port 3000 Already in Use**

```bash
# Run on different port
npm run dev -- -p 3001
```

### Docker Issues

**Port Already in Use**

```bash
# Change ports in docker-compose.yml
ports:
  - "3001:3000"  # Use different host port
```

**Database Connection Issues**

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs db
docker-compose logs backend

# Restart services
docker-compose restart
```

**Fresh Start**

```bash
# Remove all data and rebuild
docker-compose down -v
docker-compose up --build
```

**Build Cache Issues**

```bash
docker-compose build --no-cache
```

---

## 🐳 Docker Commands Reference

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop containers
docker-compose down

# Fresh start (removes data)
docker-compose down -v && docker-compose up --build

# Run Prisma commands in backend
docker-compose exec backend npx prisma studio --schema=./src/prisma/schema.prisma
docker-compose exec backend npx prisma migrate deploy --schema=./src/prisma/schema.prisma

# Access PostgreSQL CLI
docker-compose exec db psql -U postgres -d vznx_challenge
```

---

## 📦 Deployment

### Vercel (Frontend Only)

The frontend can be deployed to Vercel. The `vercel.json` file is already configured for the monorepo structure.

1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will automatically detect the Next.js app in the `frontend/` directory
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` - Your backend API URL

### Backend Deployment (Railway/Render/Fly.io)

Deploy the Express backend separately:

1. Use the `backend/` directory as the root
2. Set environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NODE_ENV=production`
   - `PORT=4000`
   - `CORS_ORIGIN` - Your frontend URL

### Docker Production

```bash
# Build the images
docker-compose -f docker-compose.prod.yml build

# Run with external database
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📁 Project Structure

```
vznx-challenge/
├── backend/                # Express.js Backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   │   ├── db.js     # Prisma client instance
│   │   │   └── env.js    # Environment variables
│   │   ├── controllers/   # Request handlers
│   │   │   ├── project.controller.js
│   │   │   ├── task.controller.js
│   │   │   └── team.controller.js
│   │   ├── services/      # Business logic
│   │   │   ├── project.service.js
│   │   │   ├── task.service.js
│   │   │   └── team.service.js
│   │   ├── repositories/  # Database access layer
│   │   │   ├── project.repository.js
│   │   │   ├── task.repository.js
│   │   │   └── team.repository.js
│   │   ├── routes/        # API routes
│   │   │   ├── project.routes.js
│   │   │   ├── task.routes.js
│   │   │   └── team.routes.js
│   │   ├── middlewares/   # Express middlewares
│   │   │   └── error.middleware.js
│   │   ├── utils/         # Utilities
│   │   │   └── validations.js  # Zod schemas
│   │   ├── prisma/        # Database
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── app.js         # Express app setup
│   │   └── server.js      # Server entry point
│   ├── package.json
│   └── .env               # Backend environment variables
├── frontend/              # Next.js Frontend
│   ├── app/
│   │   ├── components/    # React components
│   │   │   ├── ProjectDashboard.tsx
│   │   │   └── ui/       # shadcn/ui components
│   │   ├── hooks/         # Custom React hooks
│   │   │   ├── use-projects.ts
│   │   │   ├── use-tasks.ts
│   │   │   └── use-team.ts
│   │   ├── projects/      # Project pages
│   │   │   └── [id]/
│   │   ├── team/          # Team page
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/              # Utilities
│   │   └── utils.ts
│   └── package.json
├── docker-compose.yml     # Docker orchestration
├── Dockerfile            # Production image
├── vercel.json           # Vercel deployment config
└── .gitignore
```

#
