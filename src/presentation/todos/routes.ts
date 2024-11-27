import { Router } from 'express';
import { TodosController } from './controller';
import { TodoDatasourceImpl } from '../../infrastructure/datasource/todo.datasource.impl';
import { TodoRepositoryImpl } from '../../infrastructure/repositories/todo.repository.impl';

export class TodoRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new TodoDatasourceImpl();
        const todoRepository = new TodoRepositoryImpl( datasource );

        const todoController = new TodosController( todoRepository );

        //*As we see, we only send the reference of the function
        //*Under the hood we are doing: router.get('/api/todos', (req, res) => todoController.getTodos(req, res) );
        router.get('/', todoController.getTodos );
        router.get('/:id', todoController.getTodoById );
        router.post('/', todoController.createTodo );
        router.put('/:id', todoController.updateTodo );
        router.delete('/:id', todoController.deleteTodo );

        return router;
    }

}