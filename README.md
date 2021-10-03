# Simply Hexagonal Logger
![Tests](https://github.com/simplyhexagonal/logger/workflows/tests/badge.svg)
[![Try logger on RunKit](https://badge.runkitcdn.com/@simplyhexagonal/logger.svg)](https://npm.runkit.com/@simplyhexagonal/logger)

Extensible asynchronous debug logger with singleton capabilities, developed to easily broadcast to
multiple communication channels/transports.

```ts
import Logger from '@simplyhexagonal/logger';

const logger = new Logger({});

logger.debug('Trying to teach', 2, 'tooters', {to: 'toot'});
```

## Open source notice

This project is open to updates by its users, [I](https://github.com/jeanlescure) ensure that PRs are relevant to the community.
In other words, if you find a bug or want a new feature, please help us by becoming one of the
[contributors](#contributors-) ✌️ ! See the [contributing section](#contributing)

## Like this module? ❤

Please consider:

- [Buying me a coffee](https://www.buymeacoffee.com/jeanlescure) ☕
- Supporting Simply Hexagonal on [Open Collective](https://opencollective.com/simplyhexagonal) 🏆
- Starring this repo on [Github](https://github.com/simplyhexagonal/logger) 🌟

## Features

- Define different communication channels per log level (i.e. send `debug` messages to console and `error` messages to Slack)
- Define multiple communication channels per log level
- Specify channel names and then simply use the `.channel()` function to send messages to any specific channel
- Extend your logging capabilities with officially supported transports for: Slack, Discord, Email, SMS, Socket
- Easily make your own transports by implementing and extending the [base LoggerTransport class type](https://github.com/simplyhexagonal/logger/blob/main/src/transports/base.ts) (and submit them via GitHub issue for adoption as an officially supported transport!)
- Use the same logger instance throughout your app (singleton logger)
- Use multiple logger instances throughout your app with de-duplicated communication channels/transports (singleton transports)
- ANSI colors and easy to read formatting for CLI terminals
- CSS colors and easy to read formatting for browser dev consoles

## Usage

Install:

```sh
npm install @simplyhexagonal/logger

yarn add @simplyhexagonal/logger

pnpm i @simplyhexagonal/logger
```

There are three basic configuration elements you should established based on your app's needs and
the environment you will deploy to:

- log level
- communication channels
- error management strategy

### Log level

There are 6 log levels:


- debug
- info
- warn
- error
- fatal
- all

In your code you log messages to specific log levels:

```ts
logger.debug('hello');

try {
  throw new Error('you shall not pass');
} catch {
  logger.error('time to turn around');
}

// 2021-10-02T23:47:27.187Z DEBUG 🐞️:
//
//    hello
//

// 2021-10-02T23:47:27.191Z ERROR 🚨️:
//
//    time to turn around
//
```

Each log level is given a number value:

```ts
{
  debug: 0,
  info: 10,
  warn: 20,
  error: 30,
  fatal: 40,
  all: 100,
}
```

When `Logger` is instantiated, it will only setup communication channels for the configured log
level and above (i.e. if you selected `warn` then the only `logLevel >= 20` would be initialized)

You can set the log level when instancing the logger:

```ts
import Logger, { LogLevels } from '@simplyhexagonal/logger';

new Logger({
  logLevel: LogLevels.DEBUG,
  //...
});
```

It is **highly recommended** to set the log level based on a condition that determines the environment
your app is running on:

```ts
const logLevel = (process.env.NODE_ENV === 'production') ? LogLevels.ERROR : LogLevels.DEBUG;

new Logger({
  logLevel,
  //...
});
```

Setting the log level using environment variables is only recommended as a way to override the
log level configured during instantiation:

```sh
# .env
LOG_LEVEL=debug
```

_(i.e. this is useful if you deem it necessary to turn on debug logging in production environments)_

### Communication channels

Let's say that you have a Discord server with a channel you want to receive only debug messages from
your app, and another channel dedicated to receiving only errors.

The debug channel has the webhook path: `/D3BU9/W3BH00K`

The error channel has the webhook path: `/3RR0R/W3BH00K`

Using `@simplyhexagonal/logger`, you can add the [official Discord transport]() as a dependency
and import it:

```ts
import DiscordTransport from '@simplyhexagonal/logger-transport-discord';
```

Then, you can configure the transports for each of Logger's log levels:

```ts
const optionsByLevel = {
  debug: [
    {
      transport: LoggerTransportName.DISCORD,
      options: {
        // debug channel webhook url
        destination: 'https://discord.com/api/webhooks/D3BU9/W3BH00K',
      },
    },
  ],
  info: [],
  warn: [],
  error: [
    {
      transport: LoggerTransportName.DISCORD,
      options: {
        // error channel webhook url
        destination: 'https://discord.com/api/webhooks/3RR0R/W3BH00K',
      },
    },
  ],
  fatal: [],
  all: [],
};
```

Thn you would let Logger which transport to use for `LoggerTransportName.DISCORD`:

```ts
const transports = {
  [LoggerTransportName.DISCORD]: DiscordTransport,
};
```

The final result would look something like this:

```ts
import {
  LogLevels,
  LoggerTransportName,
} from '@simplyhexagonal/logger';
import DiscordTransport from '@simplyhexagonal/logger-transport-discord';

const optionsByLevel = {
  debug: [
    {
      transport: LoggerTransportName.DISCORD,
      options: {
        // debug channel webhook url
        destination: 'https://discord.com/api/webhooks/D3BU9/W3BH00K',
      },
    },
  ],
  info: [],
  warn: [],
  error: [
    {
      transport: LoggerTransportName.DISCORD,
      options: {
        // error channel webhook url
        destination: 'https://discord.com/api/webhooks/3RR0R/W3BH00K',
      },
    },
  ],
  fatal: [],
  all: [],
};

const transports = {
  [LoggerTransportName.DISCORD]: DiscordTransport,
};

const options = {
  logLevel: LogLevels.DEBUG,
  optionsByLevel,
  transports,
};

const logger = new Logger(options);
```

### Error management strategy

In the previous example there's always a possibility for the Discord webhook to return an error.

When this happens Logger will default to throwing an error which can be handled using `.catch()`:

```ts
logger.debug('hello discord').catch((e) => {
  logger.channel(LoggerTransportName.CONSOLE).error(e);
});
```

We understand that this adds unnecessary complexity, as such, you are encouraged to turn on error
catching when instantiating `Logger`. When you do this, Logger will automagically catch transport
errors and log them to console (with `error` log level):

```ts
const options = {
  optionsByLevel: optionsWithBadTransport,
  catchTransportErrors: true,
};

const logger = new Logger(options);

logger.debug('this will fail due to a bad transport');

//  2021-10-03T04:31:02.191Z ERROR 🚨️:
//  
//      {
//        "transportResult": {
//          "destination": "...",
//          "channelName": "...",
//          "error": {
//            "name": "Error",
//            "message": "LOGGER ERROR: ...",
//            "stack": "Error: LOGGER ERROR: ...",
//            // ...
//          },
//        },
//        //...
//      }
//
```

Furthermore, you could implement your own fallback transport:

```ts
import { LoggerTransport } from '@simplyhexagonal/logger/transports/base';

class MyTransport extends LoggerTransport {
  constructor(options: LoggerTransportOptions['options']) {
    const r = Math.random().toString(36).substring(7);
    super({...options, r});
  }

  async error([timestamp, ...message]: unknown[]) {
    console.log(timestamp, 'MY LOG:', ...message);

    return {
      destination: this.destination,
      channelName: this.channelName,
    };
  }
}

const options = {
  optionsByLevel: optionsWithBadTransport,
  catchTransportErrors: true,
  fallbackTransport: MyTransport,
};

const logger = new Logger(options);

logger.debug('this will fail due to a bad transport');

// 2021-10-03T04:31:02.201Z MY LOG: UndefinedTransportError: ...
```

And just as with `LOG_LEVEL`, we have implemented an environment variable for overriding purposes:

```sh
# .env
LOGGER_CATCH_TRANSPORT_ERRORS=true
```

**IMPORTANT NOTE:** we recommend always setting `catchTransportErrors` to `true` in production!

### More options

```ts
import {
  LogLevels,
  LoggerTransportName,
} from '@simplyhexagonal/logger';
import DiscordTransport from '@simplyhexagonal/logger-transport-discord';

const options = {
  logLevel: LogLevels.DEBUG, // default
  optionsByLevel: {
    debug: [
      // ***
      // This console config is the default if a log level options array is left empty
      // (like `info` in this example)
      {
        transport: LoggerTransportName.CONSOLE,
        options: {
          destination: LoggerTransportName.CONSOLE,
          channelName: LoggerTransportName.CONSOLE,
        },
      },
      // if you do this you would have only one instance of this transport since all
      // transports are singleton (as in pre-filtered and de-duplicated)
      // ***
      {
        transport: LoggerTransportName.DISCORD,
        options: {
          destination: 'https://discord.com/api/webhooks/D3BU9/W3BH00K',
          channelName: 'discord-debug',
        },
      },
    ],
    info: [], // in this case `loggger.info()` will default to logging to the console
    warn: [],
    error: [
      {
        transport: LoggerTransportName.DISCORD,
        options: {
          destination: 'https://discord.com/api/webhooks/3RR0R/W3BH00K',
        },
      },
    ],
    fatal: [],
    all: [],
  },
  transports: {
    [LoggerTransportName.DISCORD]: DiscordTransport,
  },
  singleton: true, // default
  catchTransportErrors: false, // default
  fallbackTransport: MyTransport,
};

const logger = new Logger(options);
```

## The `all` log level

An important thing to note is that transports defined for the `all` will **always** be instantiated.

In the same way, calls to `logger.all()` will **always** log.

For this reason we suggest only ever using `logger.all()` when an app starts and when an app is
manually stopped.

## Channels

It can be extremely useful to setup multiple channels for specific purposes on a log level:

```ts
const logger = new Logger({
  logLevel: LogLevels.DEBUG,
  optionsByLevel: {
    warn: [],
    info: [],
    debug: [],
    error: [
      {
        transport: LoggerTransportName.SLACK,
        options: {
          destination: 'https://hooks.slack.com/services/T123/B456/M0N90',
          channelName: 'mongo',
        },
      },
      {
        transport: LoggerTransportName.SLACK,
        options: {
          destination: 'https://hooks.slack.com/services/T123/B456/M55QL',
          channelName: 'mssql',
        },
      },
    ],
    fatal: [],
    all: [],
  },
});
```

and then send messages to a specific channel depending on the event that's triggering the log:

```ts
const server = async () => {
  await mongoose.connect('mongodb://mymongo.cluster:27017/myapp').catch((e) => {
    logger.channel('mongo').error(e);
  });

  await sql.connect('Server=mymssql.cluster,1433;Database=myapp;').catch((e) => {
    logger.channel('mssql').error(e);
  });
}

server();
```

## Contributing

Yes, thank you! This plugin is community-driven, most of its features are from different authors.
Please update the docs and tests and add your name to the `package.json` file.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://jeanlescure.cr"><img src="https://avatars2.githubusercontent.com/u/3330339?v=4" width="100px;" alt=""/><br /><sub><b>Jean Lescure</b></sub></a><br /><a href="#maintenance-jeanlescure" title="Maintenance">🚧</a> <a href="https://github.com/simplyhexagonal/logger/commits?author=jeanlescure" title="Code">💻</a> <a href="#userTesting-jeanlescure" title="User Testing">📓</a> <a href="https://github.com/simplyhexagonal/logger/commits?author=jeanlescure" title="Tests">⚠️</a> <a href="#example-jeanlescure" title="Examples">💡</a> <a href="https://github.com/simplyhexagonal/logger/commits?author=jeanlescure" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/2huBrulee"><img src="https://avatars.githubusercontent.com/u/29010617?v=4" width="100px;" alt=""/><br /><sub><b>Alejandro Merino</b></sub></a><br /><a href="#maintenance-2huBrulee" title="Maintenance">🚧</a> <a href="https://github.com/simplyhexagonal/logger/commits?author=2huBrulee" title="Code">💻</a> <a href="#userTesting-2huBrulee" title="User Testing">📓</a> <a href="https://github.com/simplyhexagonal/logger/commits?author=2huBrulee" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
## License

Copyright (c) 2021-Present [Logger Contributors](https://github.com/simplyhexagonal/logger/#contributors-).<br/>
Licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

