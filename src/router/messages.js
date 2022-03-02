import express from 'express';
import { body } from 'express-validator';
import 'express-async-errors';
//
import * as messagesController from '../controller/messages.js';
import { validate } from '../middleware/validator.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

const validateMessage = [
  body('text')
    .trim()
    .isLength({ min: 3 })
    .withMessage('text should be at least 3 characters.'),
  validate,
];

router
  .get('/', isAuth, messagesController.getMessages)
  .get('/:id', isAuth, messagesController.getMessage)
  .post('/', isAuth, validateMessage, messagesController.createMessage)
  .put('/:id', isAuth, validateMessage, messagesController.updateMessage)
  .delete('/:id', isAuth, messagesController.deleteMessage);

export default router;
