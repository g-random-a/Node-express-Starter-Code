import express from 'express';
import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../contrib/swagger/swagger.json';
import InitApp from './startups/initApp';
import helmet from 'helmet';
import requestLoggerMiddleware from './middleware/requestLogger';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(requestLoggerMiddleware);

interface Route {
  path: string;
  handler: express.Router;
}
const routes: Route[] = [];

const registerRoute = (path: string, handler: express.Router) => {
  routes.push({ path, handler });
  app.use(path, handler);
};

const swaggerRouter = express.Router();
swaggerRouter.use(swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const configureApp = async (): Promise<void> => {
  await InitApp();

  registerRoute('/api/v1/response/api-docs', swaggerRouter);

  console.log('\n📄 API Routes:');
  console.table(
    routes.map((route) => ({
      Path: route.path,
      Handler: route.handler.stack?.[0]?.name || 'anonymous',
    })),
  );
};

export { app, configureApp };
