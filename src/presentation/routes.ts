import { Router } from 'express';
import { TodoRoutes } from './todos/routes';

export class AppRoutes {

    //*If we need to inject dependencies we are not gonna use static on our methods
    //*Otherwise we could do it.

    static get routes(): Router {

        const router = Router();

        //*This is a middleware
        router.use('/api/todos', TodoRoutes.routes );

        return router;
    }

}