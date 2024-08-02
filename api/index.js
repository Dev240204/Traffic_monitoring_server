const express = require('express');
const app = express();
const connect = require('./connect');
const port = 3000

await connect()
.then(() => {
    console.log('Connected to database');
})
.catch((err)=>{
    console.error('Error connecting to database:', err);
})

app.get('/', (req,res)=>{
    res.send('Listening on port 3000');
})

app.listen(port, (req,res)=>{
    console.log(`Server running on port ${port}`);
})

module.exports = app;