import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get access logs (Employees see their own logs, HR sees all logs)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const role = req.user?.role;

    try {
        const logs = await prisma.accessLog.findMany({
            where: role === 'EMPLOYEE' ? { userId } : {},
            include: {
                user: { select: { name: true, email: true, role: true } },
            },
            orderBy: { loginTime: 'desc' },
            take: 100 // limit for demo
        });
        res.json(logs);
    } catch (error) {
        console.error('Get access logs error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
