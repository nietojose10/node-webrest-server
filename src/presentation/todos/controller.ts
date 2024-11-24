import { Request, Response } from 'express';

const todos = [
    { id: 1, text: 'Buy Milk', completedAt: new Date() },
    { id: 2, text: 'Buy bread', completedAt: null },
    { id: 3, text: 'Buy butter', completedAt: new Date() },
];

export class TodosController {

    //* Dependency Injection
    //* We will usually want to inject a repository
    constructor(){

    }

    public getTodos = async(req: Request, res: Response): Promise<any> => {

        return res.json(todos);
    }

    public getTodoById = async( req: Request, res: Response ): Promise<any> => {
        //*The plus operator converts the string into a number;
        const id = +req.params.id;
        if ( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number'});

        const todo = todos.find( todo => todo.id === id );

        ( todo )
        ? res.status(200).json( todo )
        : res.status(404).json({ error: `TODO with id ${ id } not found` });  
    }

    public createTodo = async( req: Request, res: Response ): Promise<any> => {

        const { text } = req.body;

        if ( !text ) return res.status(400).json({ error: 'Text property is required' });

        const newTodo = {
            id: todos.length + 1,
            text: text,
            completedAt: null
        }

        todos.push( newTodo );
        
        res.json( newTodo );

    }

    public updateTodo = async( req: Request, res: Response ): Promise<any> => {

        //*The plus operator converts the string into a number;
        const id = +req.params.id;
        if ( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number'});

        const todo = todos.find( todo => todo.id === id );
        if ( !todo ) return res.status(404).json({ error: `Todo with id ${ id } not found`});

        const { text, completedAt } = req.body;
        // if ( !text ) return res.status(400).json({ error: 'Text property is required' });

        //! Warning we are changing directly the object because it is changed by reference
        todo.text = text || todo.text;

        ( completedAt === 'null' )
        ? todo.completedAt = null
        : todo.completedAt = new Date( completedAt || todo.completedAt );

        res.json( todo );

    }

    public deleteTodo = async( req: Request, res: Response ): Promise<any> => {

        const id = +req.params.id;
        if ( isNaN(id) ) return res.status(400).json({ error: 'ID argument is not a number'});

        const todo = todos.find( todo => todo.id === id );
        if ( !todo ) return res.status(404).json({ error: `Todo with id ${ id } not found`});

        todos.splice( todos.indexOf(todo), 1 );

        return res.json( todo );
    }

}