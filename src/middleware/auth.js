import jwt from 'jsonwebtoken';
//
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';

const AUTH_ERROR = { message: 'Authentication Error' };

// router에서 쓸 미들웨어
export const isAuth = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    token = req.cookies['token'];
  }

  if (!token) {
    return res.status(401).json(AUTH_ERROR);
  }

  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      return res.status(401).json(AUTH_ERROR);
    }

    req.token = token;
    req.userId = user.id;
    next();
  });
};

// swagger에서 쓸 미들웨어
export const authHandler = async (req) => {
  const authHeader = req.get('Authorization');
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    token = req.cookies['token'];
  }

  if (!token) {
    return res.status(401).json(AUTH_ERROR);
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secretKey);
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw { status: 401, ...AUTH_ERROR };
    }

    req.token = decoded;
    req.userId = user.id;
    return true;
  } catch (err) {
    console.error(err);
  }
};
