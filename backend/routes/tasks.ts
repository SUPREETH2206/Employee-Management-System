import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get Tasks (Employees see their own tasks, HR sees all tasks)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const role = req.user?.role;

    try {
        const tasks = await prisma.task.findMany({
            where: role === 'EMPLOYEE' ? { userId } : {},
            include: {
                user: { select: { name: true, email: true } },
            },
            orderBy: { dueDate: 'asc' },
        });
        res.json(tasks);
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create Task (HR Only)
router.post('/', authenticateToken, requireRole('HR'), async (req: AuthRequest, res: Response) => {
    const { title, description, assignedBy, dueDate, userId } = req.body;

    try {
        const task = await prisma.task.create({
            data: {
                title,
                description,
                assignedBy,
                dueDate: new Date(dueDate),
                userId,
            },
            include: {
                user: { select: { name: true, email: true } },
            },
        });
        res.status(201).json(task);
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update Task Status
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body;
    const userId = req.user?.id;
    const role = req.user?.role;

    try {
        // Check if task belongs to user (if they are an employee)
        if (role === 'EMPLOYEE') {
            const task = await prisma.task.findUnique({ where: { id } });
            if (!task || task.userId !== userId) {
                return res.status(403).json({ message: 'Access denied to update this task' });
            }
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { status },
        });

        res.json(updatedTask);
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete task (HR Only)
router.delete('/:id', authenticateToken, requireRole('HR'), async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    try {
        await prisma.task.delete({ where: { id } });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
