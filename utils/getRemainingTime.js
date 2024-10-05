export const getRemainingTime = (postTime) => {
    const currentTime = Math.floor(Date.now() / 1000)
    console.error(currentTime)
    let remainingSeconds = postTime - currentTime;

    if (remainingSeconds <= 0) {
        return 'Settled';
    }

    const days = Math.floor(remainingSeconds / (24 * 3600));
    remainingSeconds %= 24 * 3600;
    const hours = Math.floor(remainingSeconds / 3600);
    remainingSeconds %= 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    let timeString = '';
    if (days > 0) timeString += `${days}d `;
    if (hours > 0) timeString += `${hours}h `;
    if (minutes > 0) timeString += `${minutes}m `;
    timeString += `${seconds}s`;

    return timeString;
};