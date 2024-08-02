const express = require('express');
const app = express();
const connect = require('./connect');
const roadRouter = require('../routes/roads');
const locationRouter = require('../routes/locations');
const port = 3000

app.use(express.urlencoded({extended: true}));
app.use(express.json());

connect()
.then(() => {
    console.log('Connected to database');
})
.catch((err)=>{
    console.error('Error connecting to database:', err);
})

app.use('/roads', roadRouter);
app.use('/locations', locationRouter);

app.get('/', (req,res)=>{
    res.send('Listening on port 3000');
})

app.listen(port, (req,res)=>{
    console.log(`Server running on port ${port}`);
})

module.exports = app;