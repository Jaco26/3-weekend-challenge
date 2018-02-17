
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const pool = require('../modules/pool'); // This is how I talk to the database
const Task = require('../modules/tasks-class'); // This is my Task class


router.get('/get-all', function(req, res) {
    const sqlText = `SELECT * FROM tasks ORDER BY id DESC`;
    pool.query(sqlText).then((result) => {
        res.send(Task.processTasks(result.rows));
    }).catch((error) => {
        console.log('error in router.get /get-all:', error);        
    });
}); // END router /get-all GET 

router.post('/add', (req, res) => {
    const newTask = req.body;
    console.log('message in router.post /add = ', newTask);
    
    const sqlText = `INSERT INTO tasks 
    (task, category, completed, due_date, date_added)
    Values($1, $2, $3, $4, NOW())`;
    pool.query(sqlText, [newTask.task, newTask.category, newTask.completed, newTask.dueDate])
    .then((result) => {
        res.sendStatus(200);
    }).catch((error) => {
        console.log('error in router.post /add:', error);
    });
}); // END router /add POST


module.exports = router;

