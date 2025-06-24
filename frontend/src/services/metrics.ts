import { Analytics } from 'firebase/analytics';
import { Performance } from 'firebase/performance';
import { logEvent } from 'firebase/analytics';
import { trace } from 'firebase/performance';

interface ProcessingMetrics {
  duration: number;
  inputSize: number;
  outputSize: number;
  quality: number;
  success: boolean;
  error?: string;
}

interface UserMetrics {
  userId: string;
  processingCount: number;
  totalDuration: number;
  averageQuality: number;
  successRate: number;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  gpu: number;
  network: {
    latency: number;
    bandwidth: number;
  };
}

export class MetricsService {
  private readonly METRICS_VERSION = '1.0.0';
  private processingHistory: Map<string, ProcessingMetrics[]> = new Map();
  private systemMetrics: SystemMetrics[] = [];
  private metricsInterval: NodeJS.Timeout;

  constructor(
    private analytics: Analytics,
    private performance: Performance
  ) {
    this.initializeMetricsCollection();
  }

  private initializeMetricsCollection() {
    // Collect system metrics every minute
    this.metricsInterval = setInterval(async () => {
      const metrics = await this.collectSystemMetrics();
      this.systemMetrics.push(metrics);
      this.pruneOldMetrics();
    }, 60000);
  }

  // Track processing performance
  public async trackProcessing(
    userId: string,
    processingId: string,
    metrics: ProcessingMetrics
  ) {
    const userHistory = this.processingHistory.get(userId) || [];
    userHistory.push(metrics);
    this.processingHistory.set(userId, userHistory);

    // Log to Firebase Analytics
    logEvent(this.analytics, 'processing_completed', {
      processing_id: processingId,
      duration: metrics.duration,
      quality: metrics.quality,
      success: metrics.success,
      input_size: metrics.inputSize,
      output_size: metrics.outputSize,
      version: this.METRICS_VERSION,
    });

    // Track performance metrics
    const perfTrace = trace(this.performance, 'processing_trace');
    perfTrace.putMetric('duration', metrics.duration);
    perfTrace.putMetric('quality', metrics.quality);
    perfTrace.putMetric('input_size', metrics.inputSize);
    perfTrace.putMetric('output_size', metrics.outputSize);
    perfTrace.stop();

    // Update user metrics
    await this.updateUserMetrics(userId);
  }

  // Get user performance metrics
  public getUserMetrics(userId: string): UserMetrics {
    const history = this.processingHistory.get(userId) || [];
    
    const metrics: UserMetrics = {
      userId,
      processingCount: history.length,
      totalDuration: history.reduce((sum, m) => sum + m.duration, 0),
      averageQuality: history.reduce((sum, m) => sum + m.quality, 0) / history.length,
      successRate: history.filter(m => m.success).length / history.length,
    };

    return metrics;
  }

  // Get system performance metrics
  public getSystemMetrics(timeRange: number = 3600000): SystemMetrics {
    const recentMetrics = this.systemMetrics.filter(
      m => Date.now() - m.timestamp < timeRange
    );

    return {
      cpu: this.calculateAverage(recentMetrics.map(m => m.cpu)),
      memory: this.calculateAverage(recentMetrics.map(m => m.memory)),
      gpu: this.calculateAverage(recentMetrics.map(m => m.gpu)),
      network: {
        latency: this.calculateAverage(recentMetrics.map(m => m.network.latency)),
        bandwidth: this.calculateAverage(recentMetrics.map(m => m.network.bandwidth)),
      },
    };
  }

  // Track error events
  public trackError(error: Error, context: any) {
    logEvent(this.analytics, 'error', {
      error_name: error.name,
      error_message: error.message,
      error_stack: error.stack,
      context: JSON.stringify(context),
      version: this.METRICS_VERSION,
    });
  }

  // Track user engagement
  public trackEngagement(userId: string, action: string, data: any) {
    logEvent(this.analytics, 'user_engagement', {
      user_id: userId,
      action,
      data: JSON.stringify(data),
      timestamp: Date.now(),
      version: this.METRICS_VERSION,
    });
  }

  // Private helper methods
  private async collectSystemMetrics(): Promise<SystemMetrics> {
    const metrics: SystemMetrics = {
      timestamp: Date.now(),
      cpu: await this.measureCPU(),
      memory: await this.measureMemory(),
      gpu: await this.measureGPU(),
      network: await this.measureNetwork(),
    };

    return metrics;
  }

  private async measureCPU(): Promise<number> {
    // Implement CPU measurement
    return 0;
  }

  private async measureMemory(): Promise<number> {
    // Implement memory measurement
    return 0;
  }

  private async measureGPU(): Promise<number> {
    // Implement GPU measurement
    return 0;
  }

  private async measureNetwork(): Promise<{ latency: number; bandwidth: number }> {
    // Implement network measurements
    return { latency: 0, bandwidth: 0 };
  }

  private async updateUserMetrics(userId: string) {
    const metrics = this.getUserMetrics(userId);
    
    logEvent(this.analytics, 'user_metrics_updated', {
      user_id: userId,
      processing_count: metrics.processingCount,
      total_duration: metrics.totalDuration,
      average_quality: metrics.averageQuality,
      success_rate: metrics.successRate,
      version: this.METRICS_VERSION,
    });
  }

  private calculateAverage(numbers: number[]): number {
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }

  private pruneOldMetrics() {
    const ONE_DAY = 24 * 60 * 60 * 1000;
    this.systemMetrics = this.systemMetrics.filter(
      m => Date.now() - m.timestamp < ONE_DAY
    );
  }

  // Cleanup
  public dispose() {
    clearInterval(this.metricsInterval);
    this.processingHistory.clear();
    this.systemMetrics = [];
  }
} 