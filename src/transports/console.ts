/* eslint-disable no-console */
import {
  yellow,
  green,
  red,
  bgRed,
  lightCyan,
  lightMagenta,
  parse,
} from 'ansicolor';

import { LoggerTransportOptions, LogLevelsEnum } from '../interfaces';
import { LoggerTransport } from './base';

const LogLevels = {...LogLevelsEnum};

export default class ConsoleTransport extends LoggerTransport {
  readonly destination: string;

  constructor(options: LoggerTransportOptions['options']) {
    const r = Math.random().toString(36).substring(7);
    super({...options, r});

    this.destination = options.destination;

    if (r !== this._r) {
      return this;
    }
  }

  async debug([prefixes, ...message]: unknown[]) {
    console.log(...this.recolor(lightMagenta(this.format(
      [
        prefixes,
        LogLevels.DEBUG.toUpperCase(),
        '🐞️:\n\n',
        ...message,
        '\n',
      ]
    ).replace(/\n/g, '\n\t'))));

    return {
      destination: this.destination,
      channelName: this.channelName,
      result: true,
    };
  }

  async info([prefixes, ...message]: unknown[]) {
    console.log(...this.recolor(green(this.format(
      [
        prefixes,
        LogLevels.INFO.toUpperCase(),
        '✅️:\n\n',
        ...message,
        '\n',
      ]
    ).replace(/\n/g, '\n\t'))));

    return {
      destination: this.destination,
      channelName: this.channelName,
      result: true,
    };
  }

  async warn([prefixes, ...message]: unknown[]) {
    console.log(...this.recolor(yellow(this.format(
      [
        prefixes,
        LogLevels.WARN.toUpperCase(),
        '🟡:\n\n',
        ...message,
        '\n',
      ]
    ).replace(/\n/g, '\n\t'))));

    return {
      destination: this.destination,
      channelName: this.channelName,
      result: true,
    };
  }

  async error([prefixes, ...message]: unknown[]) {
    console.log(...this.recolor(red(this.format(
      [
        prefixes,
        LogLevels.ERROR.toUpperCase(),
        '🚨️:\n\n',
        ...message,
        '\n',
      ]
    ).replace(/\n/g, '\n\t'))));

    return {
      destination: this.destination,
      channelName: this.channelName,
      result: true,
    };
  }

  async fatal([prefixes, ...message]: unknown[]) {
    console.log(...this.recolor(bgRed(this.format(
      [
        prefixes,
        LogLevels.FATAL.toUpperCase(),
        '💀:\n\n',
        ...message,
        '\n',
      ]
    ).replace(/\n/g, '\n\t'))));

    return {
      destination: this.destination,
      channelName: this.channelName,
      result: true,
    };
  }

  async all([prefixes, ...message]: unknown[]) {
    console.log(...this.recolor(lightCyan(this.format(
      [
        prefixes,
        LogLevels.ALL.toUpperCase(),
        '📝:\n\n',
        ...message,
        '\n',
      ]
    ).replace(/\n/g, '\n\t'))));

    return {
      destination: this.destination,
      channelName: this.channelName,
      result: true,
    };
  }

  recolor(formattedMessage: string) {
    if (this._isBrowser) {
      return parse(formattedMessage).asChromeConsoleLogArguments;
    }

    return [formattedMessage];
  }
}
