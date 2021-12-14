import { serializeError } from 'serialize-error';

import { ILoggerTransport, LoggerTransportOptions } from '../interfaces';

let XXH: any;

if (typeof window !== 'undefined') {
  XXH = (window as any).XXH;
} else {
  XXH = require('xxhashjs');
}

const stringify = (obj: unknown): string => {
  let cache: unknown[] = [];

  const result = (typeof obj === 'string') ? obj : JSON.stringify(
    obj,
    (_key, value) => {
      if (value instanceof Error) return serializeError(value);

      if (typeof value === 'object' && value !== null) {
        // Duplicate reference found, discard key
        if (cache.includes(value)) return undefined;

        // Store value in our collection
        cache.push(value);
      }
      return value;
    },
    2,
  );

  cache = [];

  return result;
};

export class LoggerTransport implements ILoggerTransport {
  static instances: { [k: string]: LoggerTransport } = {};

  readonly _id: string;

  readonly _r: string;

  readonly _isBrowser: boolean | '' | undefined;

  readonly channelName: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async debug(..._message: unknown[]) { return {}; }

  async info(..._message: unknown[]) { return {}; }

  async warn(..._message: unknown[]) { return {}; }

  async error(..._message: unknown[]) { return {}; }

  async fatal(..._message: unknown[]) { return {}; }

  async all(..._message: unknown[]) { return {}; }

  async raw(..._message: unknown[]) { return {}; }

  format(message: unknown[]): string {
    return message.map(stringify).join(' ').replace(/\n (\S)/g, '\n$1');
  }

  constructor({ r, destination, channelName }: (LoggerTransportOptions['options'] & {r?: string})) {
    this._id = XXH.h32(destination, 0xabcd).toString(16);
    this._r = r as string;
    this._isBrowser = process.env.IS_BROWSER && process.env.IS_BROWSER === 'TRUE';
    this.channelName = channelName || '-';

    if (LoggerTransport.instances[this._id]) {
      return LoggerTransport.instances[this._id];
    }

    LoggerTransport.instances[this._id] = this;
  }
}

export type LoggingFunctions = keyof LoggerTransport;
