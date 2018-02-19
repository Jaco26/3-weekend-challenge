
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const pool = require('../modules/pool'); // This is how I talk to the database
const Task = require('../modules/tasks-class'); // This is my Task class



router.get('/get-all', function(req, res) {
    const sqlText = ` SELECT DATE_PART('days', due_date::timestamp - 'NOW()'::timestamp), * FROM tasks ORDER BY date_part DESC`;
    pool.query(sqlText).then((result) => {
        res.send(Task.processTasks(result.rows));
    }).catch((error) => {
        console.log('error in router.get /get-all:', error);        
    }); // END pool.query
}); // END router /get-all GET 

router.post('/add', (req, res) => {
    const newTask = req.body;
    console.log('message in router.post /add = ', newTask);
    const sqlTextForTASKS = `INSERT INTO tasks 
    (task, category, notes, completed, due_date, date_added)
    Values($1, $2, $3, $4, $5, NOW())`;
    pool.query(sqlTextForTASKS, [newTask.task, newTask.category, newTask.notes, false, newTask.dueDate])
    .then((result) => {
        res.sendStatus(200);
    }).catch((error) => {
        console.log('error in router.post /add:', error);
    }); // END pool.query
    const secondSqlText = `INSERT INTO ${newTask.category} (task, notes, completed, due_date, date_added)
    VALUES ($1, $2, $3, $4, NOW())`;
    pool.query(secondSqlText, [newTask.task,  newTask.notes, false, newTask.dueDate])
    .then((result) => {
        res.sendStatus(200);
    }).catch((error) => {
        console.log(error);
    }) // END pool.query
}); // END router /add POST

router.delete('/delete/:id', (req, res) => {
    let taskId = req.params.id;
    let sqlText = `DELETE FROM tasks WHERE id=$1`
    pool.query(sqlText, [taskId]).then((response) => {
        res.sendStatus(200);
    }).catch((error) => {
        console.log(error);
        res.sendStatus('BAD NEWS BUD')
    }); // END pool.query 
}); // END router /delete/:id DELETE

router.put('/complete/:id', (req, res) => {
    let taskCompleted = req.params.id;
    let completedStatus = req.body.completed;
    let sqlText = `UPDATE tasks SET completed=$1 WHERE id=$2`;
    pool.query(sqlText, [completedStatus, taskCompleted]).then((response) => {
        res.sendStatus(200);
    }).catch((error) => {
        console.log('error on complete/:id:', error);
    }); // END pool.query
}); // END router /complete/:id PUT

router.put('/re-open/:id', (req, res) => {
    let taskReopened = req.params.id;
    let completedStatus = req.body.completed;
    let sqlText = `UPDATE tasks SET completed=$1 WHERE id=$2`;
    pool.query(sqlText, [completedStatus, taskReopened])
    .then((response) => {
        res.sendStatus(200);
    }).catch((error) => {
        console.log(error); 
    }); // END pool.query
}); // END router /re-open/:id PUT

router.put('/edit/:id', (req, res) => {
    let taskId = req.params.id;
    let update = req.body;
    let sqlText = `UPDATE tasks SET task=$1, category=$2, notes=$3, due_date=$4 WHERE id=$5`;
    pool.query(sqlText, [update.task, update.category, update.notes, update.dueDate, taskId])
    .then((response) => {
        res.sendStatus(200);
    }).catch((error) => {
        console.log('error on edit/:id:', error);
    }); // END pool.query
}); // END router /edit/:id PUT


module.exports = router;

