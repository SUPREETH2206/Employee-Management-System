import { Router, Response, Request } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, async (req: Request, res: Response) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ reply: "Please provide a message." });
    }

    const lowerMsg = message.toLowerCase();

    let reply = "I'm sorry, I'm just a simple bot. Try asking about 'leave', 'meetings', or 'tasks'.";

    if (lowerMsg.includes('leave')) {
        reply = "To apply for leave, navigate to the **Leave** page from the sidebar, click 'Request Leave', select your dates, provide a reason, and submit. HR will review it shortly.";
    } else if (lowerMsg.includes('meeting')) {
        reply = "To schedule a meeting (if you are HR), go to the **Meetings** page and click 'Schedule Meeting'. Everyone can see their upcoming meetings there.";
    } else if (lowerMsg.includes('task')) {
        reply = "On the **Tasks** page, you can see tasks assigned to you. Use the dropdown on the task card to update its status to 'In Progress' or 'Completed'.";
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        reply = "Hello there! How can I help you navigate Workwise today?";
    }

    // Simulate network delay for natural feel
    setTimeout(() => {
        res.json({ reply });
    }, 1000);
});

export default router;
