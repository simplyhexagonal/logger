const Logger = require('@simplyhexagonal/logger');

const logger = new Logger({});

logger.debug('Trying to teach', 2, 'tooters', {to: 'toot'});
