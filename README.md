# Employee Portal

A full-stack web application designed for comprehensive employee management. Features include tasks distribution, leave tracking, personal meetings, access logs, and profile management with an HR/Employee role-based system.

## Project Structure
- `backend/`: Node.js, Express, Prisma ORM, SQLite.
- `frontend/`: React, TypeScript, Vite, Tailwind-like custom CSS.

## Features
- **Dashboard**: Company growth chart, status cards, and announcements.
- **Role-based Auth**: HR can manage everything, employees can only view and interact with their assigned items.
- **Tasks**: HR assigns tasks; employees update progress.
- **Meetings**: Scheduled virtual sync-ups.
- **Leave**: HR approves/rejects leaves requested by employees.
- **Access Logs**: Complete history of user login times.
- **Settings**: Update profile and change passwords safely.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a `.env` file in the `backend` folder containing:
   \`\`\`env
   PORT=5000
   JWT_SECRET=super_secret_employee_portal_key_2026
   DATABASE_URL="file:./dev.db"
   \`\`\`
4. Run Prisma database migrations and seed script:
   \`\`\`bash
   npx prisma migrate dev --name init
   npx prisma db seed
   \`\`\`
5. Start the backend development server:
   \`\`\`bash
   npm run dev
   \`\`\`

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   \`\`\`bash
   cd frontend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the frontend development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Default Demo Credentials
- **HR User:** `hr@portal.com` / `Supreeth@123`
- **Employee User:** `emp@portal.com` / `Supreeth@123`

## Deployment Steps (Render)
1. Ensure your code is pushed to a GitHub repository.
2. In Render, create two new web services: **Backend API** and **Frontend Web App**.

**Backend (Node):**
- **Build Command:** `npm install && npx prisma generate`
- **Start Command:** `node index.js` (Note: Ensure you compile ts files to js before deployment or use ts-node in production cautiously)
- **Environment Variables:** Set `JWT_SECRET` and `DATABASE_URL` (Use PostgreSQL URL on Render instead of SQLite).

**Frontend (Static Site):**
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Environment Variables:** Set the API_URL point to the rendered backend if necessary. (Ensure you update `http://localhost:5000/api` to your actual API url in the production build).
