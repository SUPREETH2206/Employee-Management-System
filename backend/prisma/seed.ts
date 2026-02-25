import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('Supreeth@123', 10);

    // Create HR User
    const hr = await prisma.user.upsert({
        where: { email: 'hr@portal.com' },
        update: {},
        create: {
            email: 'hr@portal.com',
            name: 'Super HR',
            password: passwordHash,
            role: 'HR',
            position: 'HR Manager',
            department: 'Human Resources',
            phone: '9652794812',
            gender: 'Male',
            street: '123 Main St',
            city: 'Hyderabad',
            state: 'Telangana',
        },
    });

    // Create Employee User
    const emp = await prisma.user.upsert({
        where: { email: 'emp@portal.com' },
        update: {},
        create: {
            email: 'emp@portal.com',
            name: 'John Doe',
            password: passwordHash,
            role: 'EMPLOYEE',
            position: 'Software Engineer',
            department: 'Engineering',
            phone: '1234567890',
            gender: 'Male',
            street: '456 Linking Rd',
            city: 'Mumbai',
            state: 'Maharashtra',
        },
    });

    const emp2 = await prisma.user.upsert({
        where: { email: 'emp2@portal.com' },
        update: {},
        create: {
            email: 'emp2@portal.com',
            name: 'Alice Smith',
            password: passwordHash,
            role: 'EMPLOYEE',
            position: 'UI Designer',
            department: 'Design',
            phone: '9876543210',
            gender: 'Female',
            street: '789 Park Ave',
            city: 'Bengaluru',
            state: 'Karnataka',
        },
    });

    const emp3 = await prisma.user.upsert({
        where: { email: 'emp3@portal.com' },
        update: {},
        create: {
            email: 'emp3@portal.com',
            name: 'Bob Johnson',
            password: passwordHash,
            role: 'EMPLOYEE',
            position: 'QA Engineer',
            department: 'Engineering',
            phone: '5551234567',
            gender: 'Male',
            street: '101 MG Road',
            city: 'Pune',
            state: 'Maharashtra',
        },
    });

    // --- John Doe (Employee 1) ---
    await prisma.task.create({
        data: {
            title: 'Develop Payment Gateway',
            description: 'Integrate Stripe API and handle webhooks securely.',
            assignedBy: hr.name,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
            status: 'In Progress',
            userId: emp.id,
        },
    });

    await prisma.leave.create({
        data: {
            type: 'Sick Leave',
            startDate: new Date(new Date().setDate(new Date().getDate() - 2)),
            endDate: new Date(),
            durationDays: 2,
            reason: 'Viral Fever',
            status: 'Approved',
            userId: emp.id,
        },
    });

    // --- Alice Smith (Employee 2) ---
    await prisma.task.create({
        data: {
            title: 'Design New Onboarding Flow',
            description: 'Create wireframes for the new employee onboarding module.',
            assignedBy: hr.name,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 4)),
            status: 'To Do',
            userId: emp2.id,
        },
    });

    await prisma.leave.create({
        data: {
            type: 'Paid Leave',
            startDate: new Date(new Date().setDate(new Date().getDate() + 15)),
            endDate: new Date(new Date().setDate(new Date().getDate() + 20)),
            durationDays: 5,
            reason: 'Annual Family Vacation',
            status: 'Pending',
            userId: emp2.id,
        },
    });

    // --- Bob Johnson (Employee 3) ---
    await prisma.task.create({
        data: {
            title: 'Test Production Deployment',
            description: 'Perform complete regression testing on the staging environment.',
            assignedBy: hr.name,
            dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
            status: 'Completed',
            userId: emp3.id,
        },
    });

    await prisma.leave.create({
        data: {
            type: 'Unpaid Leave',
            startDate: new Date(new Date().setDate(new Date().getDate() + 5)),
            endDate: new Date(new Date().setDate(new Date().getDate() + 6)),
            durationDays: 1,
            reason: 'Personal Emergency Errand',
            status: 'Declined',
            userId: emp3.id,
        },
    });

    // Add Demo Meeting
    await prisma.meeting.create({
        data: {
            title: 'Weekly Sync Up',
            link: 'https://meet.google.com/mock-link-123',
            scheduledTime: new Date(new Date().setDate(new Date().getDate() + 1)),
            hostId: hr.id,
        },
    });

    console.log('Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
