import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                phone: true,
                gender: true,
                street: true,
                city: true,
                district: true,
                town: true,
                state: true,
                country: true,
                position: true,
                department: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Fetch profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { name, phone, gender, street, city, district, town, state, country, avatar } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name, phone, gender, street, city, district, town, state, country, avatar },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                phone: true,
                gender: true,
                street: true,
                city: true,
                district: true,
                town: true,
                state: true,
                country: true,
                position: true,
                department: true,
            },
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all users (for directory/meeting invites)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {

    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
