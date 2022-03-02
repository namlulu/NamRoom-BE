import { config } from '../config.js';
import bcrypt from 'bcrypt';

export const csrfCheck = (req, res, next) => {
  if (
    req.method === 'GET' ||
    req.method === 'OPTIONS' ||
    req.method === 'HEAD'
  ) {
    return next();
  }

  const csrfHeader = req.get('namRoom-csrf-token');

  if (!csrfHeader) {
    console.warn('Missing required "namRoom-csrf-token"', req.headers.origin);
    return res.status(403).json({ message: 'Failed CSRF check' });
  }

  validateCsrfToken(csrfHeader) //
    .then((valid) => {
      if (!valid) {
        console.warn(
          'Value provided in "_csrf-token" header  does not match',
          req.headers.origin,
          csrfHeader
        );
        return res.status(403).json({ message: 'Failed CSRF check' });
      }
      next();
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: 'Something went wrong' });
    });
};

const validateCsrfToken = async (csrfHeader) => {
  return bcrypt.compare(config.csrf.plainToken, csrfHeader);
};
