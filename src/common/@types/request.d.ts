declare namespace Express {
    import { ValidationConfig } from '../../middlewares';
    import { Request as RootRequest } from 'express';

    export type Request = RootRequest & ValidationConfig;
}
