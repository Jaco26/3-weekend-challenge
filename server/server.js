const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const tasksRouter = require('./routes/tasks-router');

// use bodyParser.urlencoded throughout the app
app.use(bodyParser.urlencoded({extended: true}));

// use the TESTRouter
app.use('/tasks', tasksRouter);

app.use(express.static('server/public'));

app.listen(port, function(){
    console.log('Listening on port:', port); 
});