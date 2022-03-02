import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import 'express-async-errors';
import yaml from 'yamljs';
import swaggerUI from 'swagger-ui-express';
// import * as OpenAPIValidator from 'express-openapi-validator';
import * as apis from './controller/index.js';
import dotenv from 'dotenv';
//
import messagesRouter from './router/messages.js';
import authRouter from './router/auth.js';
import { config } from './config.js';
import { initSocket } from './connection/socket.js';
import { sequelize } from './db/database.js';
import { csrfCheck } from './middleware/csrf.js';
import { authHandler } from './middleware/auth.js';
import rateLimit from './middleware/rate-limiter.js';

dotenv.config();
const app = express();

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
  credentials: true,
};
const openAPIDocument = yaml.load('./src/api/openapi.yaml');

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOption));
app.use(morgan('tiny'));
app.use(rateLimit);
app.use(csrfCheck);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openAPIDocument));
app.use('/messages', messagesRouter);
app.use('/auth', authRouter);
// app.use(
//   OpenAPIValidator.middleware({
//     apiSpec: './api/openapi.yaml',
//     validateResponses: true,
//     operationHandlers: {
//       resolver: modulePathResolver,
//     },
//     validateSecurity: {
//       handlers: {
//         jwt_auth: authHandler,
//       },
//     },
//   })
// );

function modulePathResolver(_, route, apiDoc) {
  const pathKey = route.openApiRoute.substring(route.basePath.length);
  const operation = apiDoc.paths[pathKey][route.method.toLowerCase()];
  const methodName = operation.operationId;

  return apis[methodName];
}

app.use((req, res, next) => {
  return res.sendStatus(404);
});

app.use((err, req, res, next) => {
  console.log(err);
  return res.status(err.status || 500).json({
    message: err.message,
  });
});

console.log(config.cors.allowedOrigin);
sequelize.sync().then(() => {
  const server = app.listen(config.port, () => {
    console.log(
      `Backend Server Listening on port ${config.port} !!! ${new Date()}`
    );
  });
  initSocket(server);
});
