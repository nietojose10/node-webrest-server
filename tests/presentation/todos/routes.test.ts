import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';

describe('Todo route testing', () => { 

    beforeAll(async()=>{
        await testServer.start();
    });

    afterAll( ()=>{
        testServer.close();
    });

    beforeEach( async()=>{
        await prisma.todo.deleteMany();
    });

    const todo1 = { text: 'Hola mundo 1' };
    const todo2 = { text: 'Hola mundo 2' };

    test('should return TODOs api/todos', async() => { 

        await prisma.todo.createMany({
            data: [ todo1, todo2 ]
        });

        const { body } = await request( testServer.app )
            .get('/api/todos')
            .expect(200);

        expect( body ).toBeInstanceOf( Array );
        expect( body.length ).toBe(2);
        expect( body[0].text ).toBe( todo1.text );
        expect( body[1].text ).toBe( todo2.text );
        expect( body[0].completedAt ).toBeNull();


    });

    test('should return a TODO api/todos/:id', async() => { 
        
        const todoCreated = await prisma.todo.create({
            data: todo1
        });

        const { body } = await request( testServer.app )
            .get(`/api/todos/${ todoCreated.id }`)
            .expect(200);

        expect( body ).toEqual({
            id: todoCreated.id,
            text: todoCreated.text,
            completedAt: todoCreated.completedAt
        });

    });

    test('should return a 404 NotFound api/todos/:id', async() => { 

        const todoId = 1;
        const { body } = await request( testServer.app )
        .get(`/api/todos/${todoId}`)
        .expect(404);

        expect( body ).toEqual({ error: `Todo with id ${ todoId } not found` });

    });

    test('should return a new Todo api/todos', async() => { 
        
        const { body } = await request( testServer.app )
            .post('/api/todos')
            .send( todo1 )
            .expect( 201 );

        expect( body ).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            completedAt: null
        });

    });

    test('should return an error if text is not present api/todos', async() => { 
        
        const { body } = await request( testServer.app )
            .post('/api/todos')
            .send({ })
            .expect( 400 );

        expect( body ).toEqual({ error: 'Text property is required' });

    });

    test('should return an error if text is empty api/todos', async() => { 
        
        const { body } = await request( testServer.app )
            .post('/api/todos')
            .send({ text: '' })
            .expect( 400 );

        expect( body ).toEqual({ error: 'Text property is required' });

    });

    test('should return an updated TODO api/todos/:id', async() => { 
        
        const todo = await prisma.todo.create({ data: todo1 });

        const { body } = await request( testServer.app )
            .put(`/api/todos/${todo.id}`)
            .send({ text: 'Hola mundo UPDATE', completedAt: '2024-11-27' })
            .expect( 200 );

        expect( body ).toEqual({
            id: expect.any(Number),
            text: 'Hola mundo UPDATE',
            completedAt: '2024-11-27T00:00:00.000Z'
          });

    });

    //TODO: Perfom the operation with custom errors
    test('should return 404 if TODO not found', async() => { 

        const id = 1
        
        const { body } = await request( testServer.app )
            .put(`/api/todos/${id}`)
            .send({ text: 'Hola mundo UPDATE', completedAt: '2024-11-27' })
            .expect( 404 );

        expect( body ).toEqual({ error: `Todo with id ${ id } not found` });

    });

    test('should return an updated TODO only the date should be updated', async() => { 

        const todo = await prisma.todo.create({ data: todo1 });

        const updatedProposalTodo = { completedAt: '2024-11-27' };

        const { body } = await request( testServer.app )
            .put(`/api/todos/${todo.id}`)
            .send(updatedProposalTodo)
            .expect( 200 );

        expect( body ).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            completedAt: '2024-11-27T00:00:00.000Z'
          });

        

    });

    test('should delete a TODO api/todos/:id', async() => { 

        const todo = await prisma.todo.create({ data: todo1 });

        const { body } = await request( testServer.app )
            .delete(`/api/todos/${ todo.id }`)
            .expect(200);

        expect( body ).toEqual({ 
            id: expect.any(Number), 
            text: todo.text, 
            completedAt: null 
        });

    }); 

    test('should return 404 if todo do not exist api/todos/:id', async() => { 

        const todoId = 1;

        const { body } = await request( testServer.app )
            .delete(`/api/todos/${ todoId }`)
            .expect(404);

        expect( body ).toEqual({ error: `Todo with id ${todoId} not found` });

    });

})