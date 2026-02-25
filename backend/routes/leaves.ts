import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get Leaves (Employees see their own, HR sees all)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const role = req.user?.role;

    try {
        const leaves = await prisma.leave.findMany({
            where: role === 'EMPLOYEE' ? { userId } : {},
            include: {
                user: { select: { name: true, email: true, department: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(leaves);
    } catch (error) {
        console.error('Get leaves error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Request Leave (Employee)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { type, startDate, endDate, reason } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const leave = await prisma.leave.create({
            data: {
                type,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                reason,
                userId,
            },
            include: {
                user: { select: { name: true } }
            }
        });
        res.status(201).json(leave);
    } catch (error) {
        console.error('Request leave error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update Leave Status (HR Only)
router.put('/:id', authenticateToken, requireRole('HR'), async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body; // Approved, Rejected

    try {
        const updatedLeave = await prisma.leave.update({
            where: { id },
            data: { status },
            include: {
                user: { select: { name: true, email: true } },
            }
        });
        res.json(updatedLeave);
    } catch (error) {
        console.error('Update leave error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
