import 'express-async-errors';
import { getSocketIO } from '../connection/socket.js';
import * as messagesRepository from '../data/messages.js';

export const getMessages = async (req, res, next) => {
  const username = req.query.username;
  const data = await (username
    ? messagesRepository.getAllByUsername(username)
    : messagesRepository.getAll());

  return res.status(200).json(data);
};

export const getMessage = async (req, res, next) => {
  const id = req.params.id;
  const message = await messagesRepository.getById(id);

  if (message) {
    return res.status(200).json(message);
  } else {
    return res.status(404).json({ message: `Message ${id} not found.` });
  }
};

export const createMessage = async (req, res, next) => {
  const { text } = req.body;
  const userId = req.userId;
  const message = await messagesRepository.create(text, userId);

  res.sendStatus(201);
  return getSocketIO().emit('message', { action: 'create', payload: message });
};

export const updateMessage = async (req, res, next) => {
  const id = req.params.id;
  const text = req.body.text;
  const message = await messagesRepository.getById(id);

  if (!message) {
    return res.status(404).json({ message: `Message not found: ${id}` });
  }

  if (message.userId !== req.userId) {
    return res.sendStatus(403);
  }

  const updated = await messagesRepository.update(id, text);

  res.status(200).json(updated);
  return getSocketIO().emit('message', { action: 'update', payload: updated });
};

export const deleteMessage = async (req, res, next) => {
  const id = req.params.id;
  const message = await messagesRepository.getById(id);

  if (!message) {
    return res.status(404).json({ message: `Message not found: ${id}` });
  }

  if (message.userId !== req.userId) {
    return res.sendStatus(403);
  }

  await messagesRepository.remove(id);

  res.sendStatus(204);
  return getSocketIO().emit('message', { action: 'update', payload: id });
};
