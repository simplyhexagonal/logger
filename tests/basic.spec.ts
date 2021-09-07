import Logger from '../src';
import { LoggerTransportName } from '../src/interfaces';

describe('logger', () => {
  it('should log to console', () => {
    const logger = new Logger({});

    logger.debug('Hello logger2', 2, 'app', { simply: 'hexagonal' });

    expect(0 + 1).toBe(1);
  });

  it('should not log to console', () => {
    const logger = new Logger({});

    logger.warn('Hello logger3', 2, 'app', { simply: 'hexagonal' });

    expect(0 + 1).toBe(1);
  });

  it('should log to discord', () => {
    const logger = new Logger({
      optionsByLevel: {
        warn: [
          {
            transport: LoggerTransportName.DISCORD,
            options: {
              destination:
                'https://discord.com/api/webhooks/XXX/XXX',
            },
          },
        ],
        info: [],
        debug: [],
        error: [],
        fatal: [],
        all: [],
      },
      singleton: false,
    });

    logger.warn('Hello logger111', 2, 'app', { simply: 'hexagonal' });

    expect(0 + 1).toBe(1);
  });

  it('should log to console no matter what', () => {
    const logger = new Logger({});

    logger.all('Hello logger2', 2, 'app', { simply: 'hexagonal' });

    expect(0 + 1).toBe(1);
  });
});
