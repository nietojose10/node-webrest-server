import express from 'express';
import path from 'path';

interface Options {
    port: number;
    public_path?: string;
}

export class Server {

    private app = express();

    private readonly port: number;
    private readonly publicPath: string;

    constructor (options:Options){
        const { port, public_path = 'public'} = options;
        //*Despite the assignment as readonly, we can assign/initialize our properties just in the constructor.
        //*In the rest of the class is not allow as it is a readonly property
        this.port = port;
        this.publicPath = public_path;
    }

    async start() {
        
        
        //? Middlewares
        //* Public Folder
        //!when the app runs for the first time, the server will serve the public folder
        //!Therefore react is gonna be in charge of the routing
        //!Once the page is refresh in a route which is not the root route, it will serve the wildcard
        this.app.use( express.static( this.publicPath ) );

        //*This is a wildcard, if there is a request that no matches the public folder
        //*It will be redirected over here, and this code will serve the request.
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