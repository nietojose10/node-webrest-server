import { Router } from 'express';
import { TodoRoutes } from './todos/routes';

export class AppRoutes {

    //*If we need to inject dependencies we are not gonna use static on our methods
    //*Otherwise we could do it.

    //*The "get" keyword allow us to access to this method as a property ( for instance, AppRoutes.routes )
    //*We do not have to call it as method AppRoutes.routes()
    static get routes(): Router {

        const router = Router();

        //*This is a middleware
        router.use('/api/todos', TodoRoutes.routes );

        return router;
    }

}