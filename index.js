import express from 'express';
import convolutionalRouter from './routers/convolutionalRouter.js';
import hammingRouter from './routers/hammingRouter.js';
import reedSolomonRouter from './routers/reedSolomonRouter.js';

const app = express();


app.use(convolutionalRouter);
app.use(hammingRouter);
app.use(reedSolomonRouter);


app.listen(3001);