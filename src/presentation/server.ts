import express, { Router } from 'express';
import path from 'path';

interface Options {
    port: number;
    routes: Router;
    public_path?: string;
}

export class Server {

    private app = express();
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routes: Router;

    constructor (options:Options){
        const { port, routes, public_path = 'public'} = options;
        //*Despite the assignment as readonly, we can assign/initialize our properties just in the constructor.
        //*In the rest of the class is not allow as it is a readonly property
        this.port = port;
        this.publicPath = public_path;
        this.routes = routes;
    }

    async start() {
        
        
        //? Middlewares
        //*This middleware transform/serialize the body into a json
        this.app.use( express.json() ); //raw
        this.app.use( express.urlencoded({ extended: true }) ); //x-www-form-urlencoded

        //* Public Folder
        //!when the app runs for the first time, the server will serve the public folder
        //!Therefore react is gonna be in charge of the routing
        //!Once the page is refresh in a route which is not the root route, it will serve the wildcard
        this.app.use( express.static( this.publicPath ) );

        //* Routes
        this.app.use( this.routes );

        //*This is a wildcard, if there is a request that no matches the public folder
        //*It will be redirected over here, and this code will serve the request.
        //* Giving the control to the frontend router, in this case, React Router.
        this.app.get('*', (req, res) => {
            //!To see how it works the description in red up there.
            // console.log(req.url);
            // res.send('Hola mundo');
            const indexPath = path.join( __dirname + `../../../${ this.publicPath }/index.html` );
            res.sendFile(indexPath);
            
            return;
        });

        this.app.listen(this.port, () => {
            console.log(`Server running on port ${ this.port }`);
        });

    }

}