import express from 'express';
import fs from "fs";
import convolutionalRouter from './routers/convolutionalRouter.js';
import hammingRouter from './routers/hammingRouter.js';
import reedSolomonRouter from './routers/reedSolomonRouter.js';
import { exec } from 'child_process';
import dotenv from "dotenv";

dotenv.config();

const app = express();

exec('g++ convolutional.cpp -o convolutional', err => {
    if (!err) console.log("successfully compiled convolutional.cpp");
});
exec('g++ hamming_code.cpp -o hamming_code', err => {
    if (!err) console.log("succesfully compiled hamming_code.cpp");
});
exec('g++ RC_929.cpp -o RC_929', err => {
    if (!err) console.log("successfully compiled RC_929.cpp");
});


app.use(express.static('client/build'))
app.use(convolutionalRouter);
app.use(hammingRouter);
app.use(reedSolomonRouter);


app.use('*', (req, res) => {
    fs.readFile('client/build/index.html', 'utf-8', (err, data) => {
        res.send(data);
    });
});


app.listen(process.env.PORT, () => console.log(`app listening on port ${process.env.PORT}`));
