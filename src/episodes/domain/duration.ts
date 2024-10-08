export class DurationFormatter {
    static formatDuration(): string {
        const minMinutes = 45;
        const maxMinutes = 70;
        const totalMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;

        const minutes = Math.min(totalMinutes, 59);
        const seconds = 0;

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    }
}
