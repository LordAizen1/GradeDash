import { prisma } from './prisma';

const LIMITS = {
    chat: 30,
    upload: 5
};

export async function checkRateLimit(userId: string, type: 'chat' | 'upload', maxLimit?: number): Promise<{ success: boolean; remaining: number }> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            dailyMessageCount: true,
            dailyUploadCount: true,
            lastResetDate: true
        }
    });

    if (!user) return { success: false, remaining: 0 };

    const now = new Date();
    const lastReset = new Date(user.lastResetDate);

    // Check if it's a different day
    const isNewDay = lastReset.getDate() !== now.getDate() ||
        lastReset.getMonth() !== now.getMonth() ||
        lastReset.getFullYear() !== now.getFullYear();

    if (isNewDay) {
        // Reset counters and initialize this action as 1
        await prisma.user.update({
            where: { id: userId },
            data: {
                dailyMessageCount: type === 'chat' ? 1 : 0,
                dailyUploadCount: type === 'upload' ? 1 : 0,
                lastResetDate: now
            }
        });
        const limitToCheck = maxLimit ?? LIMITS[type];
        return { success: true, remaining: limitToCheck - 1 };
    }

    // Check Limit
    const currentCount = type === 'chat' ? user.dailyMessageCount : user.dailyUploadCount;
    const limit = maxLimit ?? LIMITS[type];

    if (currentCount >= limit) {
        return { success: false, remaining: 0 };
    }

    // Increment
    await prisma.user.update({
        where: { id: userId },
        data: {
            [type === 'chat' ? 'dailyMessageCount' : 'dailyUploadCount']: { increment: 1 }
        }
    });

    return { success: true, remaining: limit - (currentCount + 1) };
}
