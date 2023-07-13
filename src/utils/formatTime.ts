/**
 * Formats a time in seconds to a string in the format of minutes:seconds
 * 
 * @param time The time in seconds
 * @returns The formatted time in minutes and seconds
 */
export const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toFixed(0).padStart(2, '0');
    return `${minutes}:${seconds}`;
};