import http2 from 'http2';
import fs from 'fs';

const server = http2.createSecureServer({
    key: fs.readFileSync('./keys/server.key'),
    cert: fs.readFileSync('./keys/server.crt'),
},( req, res ) => {
    
    console.log(req.url);

    // res.writeHead(200, { 'Content-Type': 'text/html' });
    // res.write(`<h1>URL ${ req.url } </h1>`);
    // res.end();

    // const data = { name: 'John Doe', age: 30, city: 'New York' };
    // res.writeHead(200, { 'Content-Type': 'application/json' });
    //?This is the simplified way instead of using res.write() and then res.end()
    //?We just put in res.end() what we were put in res.write()
    // res.end( JSON.stringify(data) );

    if ( req.url === '/') {
        const htmlFile = fs.readFileSync('./public/index.html', 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end( htmlFile );

        return;
    }

    if ( req.url?.endsWith('.js') ) {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
    } else if( req.url?.endsWith('.css') ) {
        res.writeHead(200, { 'Content-Type': 'text/css' });
    }

    // console.log(`./public${ req.url }`);
    try {
        const responseContent = fs.readFileSync(`./public${ req.url }`, 'utf-8');
        res.end(responseContent);
    } catch (error) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end();
    }
    
});

server.listen(8080, () => {
    console.log('Server running on port 8080');
});