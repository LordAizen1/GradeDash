
export function checkCookieRateLimit(cookieValue?: string, maxLimit: number = 5): { success: boolean; newCookie: string } {
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD

    let count = 0;
    let date = today;

    if (cookieValue) {
        const parts = cookieValue.split('|');
        if (parts.length === 2) {
            count = parseInt(parts[0], 10);
            date = parts[1];
        }
    }

    // Reset if new day
    if (date !== today) {
        count = 0;
        date = today;
    }

    if (count >= maxLimit) {
        return { success: false, newCookie: `${count}|${date}` };
    }

    // Increment
    count++;
    return { success: true, newCookie: `${count}|${date}` };
}
