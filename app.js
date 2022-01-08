import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import 'express-async-errors';
import dotenv from 'dotenv';
//
import messagesRouter from './router/messages.js';
import authRouter from './router/auth.js';
import { config } from './config.js';
import { initSocket } from './connection/socket.js';
import { sequelize } from './db/database.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: config.cors.allowedOrigin,
    optionsSuccessStatus: 200,
  })
);
app.use(morgan('tiny'));

app.use('/messages', messagesRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
  return res.sendStatus(404);
});

app.use((err, req, res, next) => {
  console.log(err);
  return res.sendStatus(500);
});

sequelize.sync().then(() => {
  const server = app.listen(config.port, () => {
    console.log(
      `Backend Server Listening on port ${config.port} !!! ${new Date()}`
    );
  });
  initSocket(server);
});
