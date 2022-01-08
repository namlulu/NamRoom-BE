import dotenv from 'dotenv';
dotenv.config();

const required = (key, defaultValue = undefined) => {
  const value = process.env[key] || defaultValue;
  if (value === null || value === undefined) {
    throw new Error(`Key ${key} is undefined`);
  }

  return value;
};

export const config = {
  jwt: {
    secretKey: required('JWT_SECRET'),
    expiresInSec: parseInt(required('JWT_EXPIRES_SEC', 86400)),
  },
  bcrypt: {
    saltRounds: parseInt(required('BCRYPT_SALT_ROUNDS', 12)),
  },
  port: parseInt(required('PORT', 8080)),
  db: {
    host: 'localhost',
    user: 'root',
    database: 'NamRoom',
    password: '134679ad',
  },
  cors: {
    allowedOrigin: required('CORS_ALLOW_ORIGIN'),
  },
};
