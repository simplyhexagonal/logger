import axios, { AxiosInstance } from 'axios';
import { TransportOptions } from '../interfaces';
import { LoggerTransport } from './base';

export default class DiscordTransport extends LoggerTransport {
  private readonly _url: string;

  private readonly _axios?: AxiosInstance;

  constructor(options: TransportOptions['options']) {
    const r = Math.random().toString(36).substring(7);
    super(r, options);

    this._url = options.destination;

    if (r !== this._r) {
      return this;
    }

    this._axios = axios.create({
      url: this._url,
    });
  }

  debug(message: unknown[]): void {
    void this.postToWebhook(`🐞️ ${this.format(message)}`);
  }

  info(message: unknown[]): void {
    void this.postToWebhook(`✅️️ ${this.format(message)}`);
  }

  warn(message: unknown[]): void {
    void this.postToWebhook(`🟡 ${this.format(message)}`);
  }

  error(message: unknown[]): void {
    void this.postToWebhook(`🚨️ ${this.format(message)}`);
  }

  fatal(message: unknown[]): void {
    void this.postToWebhook(`💀 ${this.format(message)}`);
  }

  all(message: unknown[]): void {
    void this.postToWebhook(`📝 ${this.format(message)}`);
  }

  private async postToWebhook(message: string): Promise<void> {
    try {
      const body = {
        content: message,
      };

      const response = await (this._axios as AxiosInstance).post<undefined>(this._url, body);

      if (response.status !== 204) throw new Error('Bad Response');
    } catch (e) {
      console.error(e);
    }
  }
}
