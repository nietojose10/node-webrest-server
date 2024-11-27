import { Request, Response } from 'express';
import { prisma } from '../../data/postgres';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';
import { TodoRepository } from '../../domain';

// const todos = [
//     { id: 1, text: 'Buy Milk', completedAt: new Date() },
//     { id: 2, text: 'Buy bread', completedAt: null },
//     { id: 3, text: 'Buy butter', completedAt: new Date() },
// ];

export class TodosController {

    //* Dependency Injection
    //* We will usually want to inject a repository
    constructor(
        private readonly todoRepository: TodoRepository,
    ){

    }

    public getTodos = async(req: Request, res: Response): Promise<any> => {

        const todos = await this.todoRepository.getAll();
        
        return res.json(todos);
    }

    public getTodoById = async( req: Request, res: Response ): Promise<any> => {
        //*The plus operator converts the string into a number;
        const id = +req.params.id;

        try {
            const todo = await this.todoRepository.findById(id);
            res.json(todo);
        } catch (error) {
            res.status(400).json({ error });
        }

    }

    public createTodo = async( req: Request, res: Response ): Promise<any> => {

        const [ error, createTodoDto ] = CreateTodoDto.create( req.body );

        if ( error ) return res.status(400).json({ error });

        const todo = await this.todoRepository.create( createTodoDto! );

        res.json( todo );
    }

    public updateTodo = async( req: Request, res: Response ): Promise<any> => {

        //*The plus operator converts the string into a number;
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });
        if ( error ) return res.status(400).json({ error });

        const updatedTodo = await this.todoRepository.updateById( updateTodoDto! );

        return res.json( updatedTodo );

    }

    public deleteTodo = async( req: Request, res: Response ): Promise<any> => {

        const id = +req.params.id;

        const deletedTodo = await this.todoRepository.deleteById( id );

        res.json(deletedTodo);
        
    }

}