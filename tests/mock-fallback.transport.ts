import {
  LoggerTransportOptions,
  LoggerTransport,
} from '../src';

export default class MockFallbackTransport extends LoggerTransport {
  readonly destination: string;

  constructor(options: LoggerTransportOptions['options']) {
    const r = Math.random().toString(36).substring(7);
    super({...options, r});

    this.destination = 'mock';

    if (r !== this._r) {
      return this;
    }
  }

  async error([timestamp, ...message]: unknown[]) {
    console.log(timestamp, 'MOCK:', ...message);

    return {
      destination: this.destination,
      channelName: this.channelName,
    };
  }
}