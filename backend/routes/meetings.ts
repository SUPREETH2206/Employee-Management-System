import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get meetings for the user (everyone can see upcoming meetings)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const meetings = await prisma.meeting.findMany({
            where: { scheduledTime: { gte: new Date() } },
            include: { host: { select: { name: true } } },
            orderBy: { scheduledTime: 'asc' }
        });
        res.json(meetings);
    } catch (error) {
        console.error('Get meetings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create meeting (HR Only for simplicity in demo, or limit as needed)
router.post('/', authenticateToken, requireRole('HR'), async (req: AuthRequest, res: Response) => {
    const hostId = req.user?.id;
    const { title, link, scheduledTime, participants } = req.body;

    if (!hostId) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const meeting = await prisma.meeting.create({
            data: {
                title,
                link,
                scheduledTime: new Date(scheduledTime),
                participants,
                hostId
            }
        });
        res.status(201).json(meeting);
    } catch (error) {
        console.error('Create meeting error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
