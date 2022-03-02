import { Server } from 'socket.io';
import Jwt from 'jsonwebtoken';
import { config } from '../config.js';

class Socket {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: config.cors.allowedOrigin,
      },
    });

    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authenication Error'));
      }

      Jwt.verify(token, config.jwt.secretKey, (error, decoded) => {
        if (error) {
          return next(new Error('Authenication Error'));
        }
        next();
      });
    });

    this.io.on('connection', (socket) => {
      console.log('Socket client connected');
    });
  }
}

let socket;
export const initSocket = (server) => {
  if (!socket) {
    socket = new Socket(server);
  }
};

export const getSocketIO = () => {
  if (!socket) {
    throw new Error('Please call init first');
  }

  return socket.io;
};
