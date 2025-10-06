import { Page, Request, Response } from 'playwright';
import { NetworkMetrics } from '../types.js';

interface NetworkRequest {
  url: string;
  startTime: number;
  endTime: number;
  requestSize: number;
  responseSize: number;
  statusCode: number;
}

export class NetworkTracker {
  #requests: NetworkRequest[] = [];
  #page: Page;
  #tracking: boolean = false;

  constructor(page: Page) {
    this.#page = page;
  }

  start(): void {
    this.#tracking = true;
    this.#requests = [];

    this.#page.on('request', this.#handleRequest);
    this.#page.on('response', this.#handleResponse);
  }

  stop(): void {
    this.#tracking = false;
    this.#page.off('request', this.#handleRequest);
    this.#page.off('response', this.#handleResponse);
  }

  reset(): void {
    this.#requests = [];
  }

  getMetrics(): NetworkMetrics {
    let result: NetworkMetrics;
    const totalBytes = this.#requests.reduce(
      (sum, req) => sum + req.requestSize + req.responseSize,
      0
    );

    // Calculate wall-clock duration (earliest start to latest end)
    // This represents actual time spent waiting on network, accounting for parallel requests
    let totalDuration = 0;
    if (this.#requests.length > 0) {
      const earliestStart = Math.min(...this.#requests.map(req => req.startTime));
      const latestEnd = Math.max(...this.#requests.map(req => req.endTime));
      totalDuration = latestEnd - earliestStart;
    }

    const largestRequestSize = this.#requests.reduce((max, req) => {
      const totalSize = req.requestSize + req.responseSize;
      return totalSize > max ? totalSize : max;
    }, 0);

    const apiResponseTimes = this.#requests
      .filter(req => req.url.includes('/api/'))
      .map(req => req.endTime - req.startTime);

    result = {
      requestCount: this.#requests.length,
      totalBytes,
      totalDuration,
      largestRequestSize,
      apiResponseTimes,
    };
    return result;
  }

  #handleRequest = (request: Request): void => {
    if (!this.#tracking) {
      return;
    }

    const url = request.url();
    const startTime = Date.now();
    const requestSize = this.#estimateRequestSize(request);

    // Store request data temporarily
    (request as any).__startTime = startTime;
    (request as any).__requestSize = requestSize;
  };

  #handleResponse = async (response: Response): Promise<void> => {
    if (!this.#tracking) {
      return;
    }

    const request = response.request();
    const startTime = (request as any).__startTime || Date.now();
    const requestSize = (request as any).__requestSize || 0;
    const endTime = Date.now();

    let responseSize = 0;
    try {
      const body = await response.body();
      responseSize = body.length;
    } catch (error) {
      // Response may not have a body
      responseSize = 0;
    }

    this.#requests.push({
      url: request.url(),
      startTime,
      endTime,
      requestSize,
      responseSize,
      statusCode: response.status(),
    });
  };

  #estimateRequestSize(request: Request): number {
    let result: number;
    const headers = request.headers();
    const url = request.url();

    // Estimate header size
    let headerSize = 0;
    for (const [key, value] of Object.entries(headers)) {
      headerSize += key.length + value.length + 4; // +4 for ": " and "\r\n"
    }

    // Add request line size (method + URL + HTTP version)
    const requestLineSize = request.method().length + url.length + 12; // "HTTP/1.1\r\n"

    // Estimate body size (for POST/PUT requests)
    const postData = request.postDataBuffer();
    const bodySize = postData ? postData.length : 0;

    result = requestLineSize + headerSize + bodySize;
    return result;
  }
}
