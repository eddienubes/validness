import express from 'express';
import { RequestHandler, Express, ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import { parseReqBody } from '../../src';
import util from 'util';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log(util.inspect(err, { depth: null }));
    res.setHeader('content-type', 'application/json');
    res.status(err.statusCode || 500).json({
        ...err
    });
};

export const createRouteWithPipe = (pipe: RequestHandler, middleware?: RequestHandler): Express => {
    const app = express();
    app.use(bodyParser.json());

    if (middleware) {
        app.use(middleware);
    }

    app.get('/', pipe, (req, res) => {
        const parsedBody = parseReqBody(req.body);
        res.json({ data: parsedBody });
    });
    app.use(errorHandler);

    return app;
};
