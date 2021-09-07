/* eslint-disable no-console */
import { LoggerTransportOptions } from '../interfaces';
import { LoggerTransport } from './base';

export const errorString = `LOGGER ERROR: transport "TRANSPORT_NAME" is NOT available, it was not defined in the logger options!`;

export default class UndefinedTransport extends LoggerTransport {
  constructor({name, destination}: LoggerTransportOptions['options']) {
    super({destination, r: name || destination});
  }

  async debug(message: unknown[]) {
    this.throwDefault();
    return {};
  }

  async info(message: unknown[]) {
    this.throwDefault();
    return {};
  }

  async warn(message: unknown[]) {
    this.throwDefault();
    return {};
  }

  async error(message: unknown[]) {
    this.throwDefault();
    return {};
  }

  async fatal(message: unknown[]) {
    this.throwDefault();
    return {};
  }

  async all(message: unknown[]) {
    this.throwDefault();
    return {};
  }

  throwDefault() {
    throw new Error(errorString.replace('TRANSPORT_NAME', this._r));
  }
}
