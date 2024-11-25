import { Request, Response } from 'express';
import { prisma } from '../../data/postgres';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';

// const todos = [
//     { id: 1, text: 'Buy Milk', completedAt: new Date() },
//     { id: 2, text: 'Buy bread', completedAt: null },
//     { id: 3, text: 'Buy butter', completedAt: new Date() },
// ];

export class TodosController {

    //* Dependency Injection
    //* We will usually want to inject a repository
    constructor(){

    }

    public getTodos = async(req: Request, res: Response): Promise<any> => {

        const todos = await prisma.todo.findMany();

        return res.json(todos);
    }

    public getTodoById = async( req: Request, res: Response ): Promise<any> => {
        //*The plus operator converts the string into a number;
        const id = +req.params.id;
        if ( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number'});

        const todo = await prisma.todo.findFirst({
            where: { id }
        });

        ( todo )
        ? res.status(200).json( todo )
        : res.status(404).json({ error: `TODO with id ${ id } not found` });  
    }

    public createTodo = async( req: Request, res: Response ): Promise<any> => {

        const [ error, createTodoDto ] = CreateTodoDto.create( req.body );

        if ( error ) return res.status(400).json({ error });

        const todo = await prisma.todo.create({
            data: createTodoDto!
        });
        
        res.json( todo );

    }

    public updateTodo = async( req: Request, res: Response ): Promise<any> => {

        //*The plus operator converts the string into a number;
        const id = +req.params.id;

        const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });

        if ( error ) return res.status(400).json({ error });

        const todo = await prisma.todo.findFirst({
            where: { id }
        });
        
        if ( !todo ) return res.status(404).json({ error: `Todo with id ${ id } not found`});

        //! Warning we are changing directly the object because it is changed by reference
        // todo.text = text || todo.text;
        // ( completedAt === 'null' )
        // ? todo.completedAt = null
        // : todo.completedAt = new Date( completedAt || todo.completedAt );

        const updatedtodo = await prisma.todo.update({
            where: { id },
            data: updateTodoDto!.values
        });

        res.json( updatedtodo );

    }

    public deleteTodo = async( req: Request, res: Response ): Promise<any> => {

        const id = +req.params.id;

        const todo = await prisma.todo.findFirst({
            where: { id }
        });

        if ( !todo ) return res.status(404).json({ error: `Todo with id ${ id } not found`});

        const deleted = await prisma.todo.delete({
            where: { id }
        });

        ( deleted )
        ? res.json( deleted )
        : res.status(400).json({ error: `Todo with id ${ id } not found` });
        // todos.splice( todos.indexOf(todo), 1 );
    }

}