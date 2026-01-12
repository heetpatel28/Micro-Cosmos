
export interface Metrics {
    totalGenerations: number;
    failedGenerations: number;
    successfulGenerations: number;
    averageDurationMs: number;
}

class MetricsService {
    private metrics: Metrics = {
        totalGenerations: 0,
        failedGenerations: 0,
        successfulGenerations: 0,
        averageDurationMs: 0,
    };

    private durations: number[] = [];

    recordGeneration(success: boolean, durationMs: number) {
        this.metrics.totalGenerations++;

        if (success) {
            this.metrics.successfulGenerations++;
        } else {
            this.metrics.failedGenerations++;
        }

        this.durations.push(durationMs);

        // Keep only last 100 durations for average calculation to prevent memory growth
        if (this.durations.length > 100) {
            this.durations.shift();
        }

        this.metrics.averageDurationMs =
            this.durations.reduce((a, b) => a + b, 0) / this.durations.length;
    }

    getMetrics(): Metrics {
        return { ...this.metrics };
    }
}

export const metricsService = new MetricsService();
