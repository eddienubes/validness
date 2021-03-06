import express from 'express';
import { RequestHandler, Express, ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(err.statusCode).json({
        ...err
    });
};

export const serverUtils = async <T>(pipe: RequestHandler<unknown, unknown, T>): Promise<T> => {
    const app = express();

    return new Promise((resolve, reject) => {
        app.get('/', pipe, (req) => {
            resolve(req.body);

            if (!req.body) {
                reject('Body is undefined');
            }
        });
    });
};

export const createRouteWithPipe = (pipe: RequestHandler, middleware?: RequestHandler): Express => {
    const app = express();
    app.use(bodyParser.json());

    if (middleware) {
        app.use(middleware);
    }

    app.get('/', pipe, (req, res) => {
        res.json({ data: req.body });
    });
    app.use(errorHandler);

    return app;
};
