import express from 'express';

const app = express();


app.get('/index', (req, res) => {
    res.send("Hello thang cho Khoa");
});


app.listen(3001);