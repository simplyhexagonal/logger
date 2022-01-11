import {
  LoggerTransportOptions,
  LoggerTransport,
} from '../src';

export default class MockTransport extends LoggerTransport {
  readonly transportName: undefined | string;
  readonly destination: string;
  readonly mockCallback: (...message: unknown[]) => Promise<any>;

  constructor(options: LoggerTransportOptions['options'] & {callback: (message: unknown[]) => Promise<any>}) {
    const r = Math.random().toString(36).substring(7);
    super({...options, r});

    this.destination = options.destination;
    this.transportName = options.name;
    this.mockCallback = options.callback;
  }

  async debug(...message: unknown[]) {
    await this.mockCallback(...message);

    return {
      destination: this.destination,
      channelName: this.channelName,
      result: true,
    };
  }

  async info(...message: unknown[]) {
    await this.mockCallback(...message);

    return {
      destination: this.destination,
      channelName: this.channelName,
      result: true,
    };
  }

  async warn(...message: unknown[]) {
    await this.mockCallback(...message);

    return {
      destination: this.destination,
      channelName: this.channelName,
      result: true,
    };
  }

  async error(...message: unknown[]) {
    await this.mockCallback(...message);

    return {
      destination: this.destination,
      channelName: this.channelName,
      result: true,
    };
  }

  async fatal(...message: unknown[]) {
    await this.mockCallback(...message);

    return {
      destination: this.destination,
      channelName: this.channelName,
      result: true,
    };
  }

  async all(...message: unknown[]) {
    await this.mockCallback(...message);

    return {
      destination: this.destination,
      channelName: this.channelName,
      result: true,
    };
  }

  async raw(...message: unknown[]) {
    await this.mockCallback(...message);

    return {
      destination: this.destination,
      channelName: this.channelName,
      result: true,
    };
  }
}
