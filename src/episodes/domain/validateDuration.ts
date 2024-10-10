import { BadRequestException } from "@nestjs/common";

export class ValidateDuration {
    static validateDuration(duration: string): void {
        // La duración debe seguir el patrón mm:ss o 60:00
        const durationPattern = /^([0-5]?[0-9]):([0-5][0-9])$|^60:00$/;
        if (!durationPattern.test(duration)) {
            throw new BadRequestException('Duration must be in the format mm:ss');
        }

        // Validar rango de duración
        const [minutes, seconds] = duration.split(':').map(Number);
        const totalSeconds = minutes * 60 + seconds;
        const minDuration = 15 * 60; // 15:00 en segundos
        const maxDuration = 60 * 60; // 60:00 en segundos

        if (totalSeconds < minDuration || totalSeconds > maxDuration) {
            throw new BadRequestException('Duration must be between 15:00 and 60:00');
        }
    }
}