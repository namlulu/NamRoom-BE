import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'express-async-errors';
//
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';

export const signup = async (req, res, next) => {
  const { username, password, name, email, url } = req.body;
  const found = await userRepository.findByUsername(username);

  if (found) {
    return res.status(404).json({ message: `${username} already exists.` });
  }

  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  const userId = await userRepository.createUser({
    username,
    password: hashed,
    name,
    email,
    url,
  });
  const token = createJwtToken(userId);

  return res.status(201).json({ token, username });
};

export const login = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await userRepository.findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid user information' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid user information' });
  }

  const token = createJwtToken(user.id);
  return res.status(200).json({ token, username });
};

export const me = async (req, res, next) => {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({ token: req.token, username: user.username });
};

export const createJwtToken = (id) => {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
};
