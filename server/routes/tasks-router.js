
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const pool = require('../modules/pool'); // This is how I talk to the database
const Task = require('../modules/tasks-class'); // This is my Task class



router.get('/get-all', function(req, res) {
    const sqlText = ` SELECT DATE_PART('day', due_date::timestamp - 'NOW()'::timestamp), * FROM tasks ORDER BY due_date ASC`;
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
    (task, category, notes, completed, due_date, date_added)
    Values($1, $2, $3, $4, $5, NOW())`;
    pool.query(sqlText, [newTask.task, newTask.category, newTask.notes, false, newTask.dueDate])
    .then((result) => {
        res.sendStatus(200);
    }).catch((error) => {
        console.log('error in router.post /add:', error);
    });
}); // END router /add POST

router.delete('/delete/:id', (req, res) => {
    let taskId = req.params.id;
    let sqlText = `DELETE FROM tasks WHERE id=$1`
    pool.query(sqlText, [taskId]).then((response) => {
        res.sendStatus(200);
    }).catch((error) => {
        console.log(error);
        res.sendStatus('BAD NEWS BUD')
    }); // END pool.query et. al.
}); // END router /delete/:id DELETE

router.put('/complete/:id', (req, res) => {
    let taskCompleted = req.params.id;
    let newStatus = req.body.newStatus;
    let sqlText = `UPDATE tasks SET completed=$1 WHERE id=$2`;
    pool.query(sqlText, [newStatus, taskCompleted]).then((response) => {
        res.sendStatus(200);
    }).catch((error) => {
        console.log(error);
    }); // END pool.query
}); // END router complete/:id PUT


module.exports = router;

