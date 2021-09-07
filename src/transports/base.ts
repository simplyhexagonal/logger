import { serializeError } from 'serialize-error';
import XXH from 'xxhashjs';

import { ILoggerTransport, TransportOptions } from '../interfaces';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  debug(_message: unknown[]): void {}

  info(_message: unknown[]): void {}

  warn(_message: unknown[]): void {}

  error(_message: unknown[]): void {}

  fatal(_message: unknown[]): void {}

  all(_message: unknown[]): void {}

  format(message: unknown[]): string {
    return message.map(stringify).join(' ');
  }

  constructor(r: string, { destination }: TransportOptions['options']) {
    this._id = XXH.h32(destination, 0xabcd).toString(16);
    this._r = r;
    this._isBrowser = process.env.IS_BROWSER && process.env.IS_BROWSER === 'TRUE';

    if (LoggerTransport.instances[this._id]) {
      return LoggerTransport.instances[this._id];
    }

    LoggerTransport.instances[this._id] = this;
  }
}

export type LoggingFunctions = keyof LoggerTransport;
