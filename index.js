import express from 'express';
import convolutionalRouter from './routers/convolutionalRouter.js';
import hammingRouter from './routers/hammingRouter.js';
import reedSolomonRouter from './routers/reedSolomonRouter.js';

import { exec } from 'child_process';

const app = express();


// compile cpp files before running the server
exec('g++ convolutional.cpp -o convolutional.exe');
exec('g++ hamming_code.cpp -o hamming_code.exe');
exec('g++ RC_929.cpp -o RC_929.exe');


app.use(convolutionalRouter);
app.use(hammingRouter);
app.use(reedSolomonRouter);


app.listen(3001);