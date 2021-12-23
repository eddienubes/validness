import express from 'express';
import { RequestHandler, Express } from 'express';
import bodyParser from 'body-parser';


export const createRouteAndGetBody = async <T>(pipe: RequestHandler<{}, {}, T>): Promise<T> => {
  const app = express();

  return new Promise(((resolve, reject) => {
    app.get('/', pipe, (req) => {
      resolve(req.body);

      if (!req.body) {
        reject('Body is undefined');
      }
    });
  }));
};

export const createRouteWithPipe = (pipe: RequestHandler): Express => {
  const app = express();
  app.use(bodyParser.json());
  app.get('/', pipe, (req, res) => {
    res.json({ data: req.body });
  });
  return app;
};

