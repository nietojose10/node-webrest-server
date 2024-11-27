// import {describe, expect, test} from '@jest/globals';

import { envs } from "../src/config/envs";
import { Server } from "../src/presentation/server"

//*We are mockings this whole path
jest.mock('../src/presentation/server');

describe('Testing App.ts', () => { 

    test('should call server with arguments and start', async() => { 
        
        //*We run the app file
        await import('../src/app');

        expect( Server ).toHaveBeenCalledTimes(1);
        expect( Server ).toHaveBeenCalledWith({
            port: envs.PORT,
            public_path: envs.PUBLIC_PATH,
            routes: expect.any(Function)
        });

        expect( Server.prototype.start ).toHaveBeenCalled();
        
    });

})