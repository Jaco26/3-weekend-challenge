const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 5000;

// !!!! This is a TEST router !!!! 
// REAL routers will come when I know my database structure
const tasksRouter = require('./routes/tasks');
// use the TESTRouter
app.use('/tasks', tasksRouter);
// use bodyParser.urlencoded throughout the app
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

app.listen(PORT, function(){
    console.log('Listening on port:', PORT); 
});