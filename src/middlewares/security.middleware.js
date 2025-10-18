import logger from '#config/logger.js';
import aj from '#config/arcjet.js';
import { slidingWindow } from '@arcjet/node';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';
    let limit;
    let message;

    switch (role) {
      case 'admin':
        limit = 20;
        message =
          'Admin request limit is exceeded (20 per minute). slow down !';
        break;
      case 'user':
        limit = 10;
        message = 'User request limit is exceeded (10 per minute). slow down !';
        break;
      case 'guest':
        limit = 5;
        message = 'Guest request limit is exceeded (5 per minute). slow down !';
        break;
    }

    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role}-rate-limit`,
      })
    );

    const decision = await client.protect(req);

    // for bot detection n block
    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Bot request blocked !', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Automated request are not allowed !',
      });
    }

    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield request blocked !', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Request blocked by security policy !',
      });
    }
    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded !', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      return res
        .status(429)
        .json({ error: 'Forbidden', message: 'Too Many Requests !' + message });
    }

    next();
  } catch (error) {
    logger.error('securityMiddleware error', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'something went wrong !',
    });
  }
};

export default securityMiddleware;
