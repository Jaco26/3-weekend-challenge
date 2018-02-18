$(document).ready(function() {
    getTasks();
    $('#trigger-add-task-modal').on('click', function () {
        $('#add-task-modal').fadeIn();
    }); // END #trigger-add-task-modal onclick
    $('body').on('click', function(e){
        if (e.target.matches('.modal') && !e.target.matches('.modal-content')){
            fadeOutModals()
        }
    }); // END body onclick for fadeOut .modal
 
    $('#submitTask').on('click', function(){
        validateTask(packageNewTask());
    }); // END #submitTask onclick

    $('#tasks-display').on('click', '.delete-btn', function(){
        $('#delete-confirm-modal').fadeIn();
        let id = $(this).data('id');
        $('#confirm-delete').on('click', function(){
            deleteTask(id);
            fadeOutModals();
        });
        $('#cancel-delete').on('click', fadeOutModals)
    }); // END .delete-btn onclick


    
}); // END document.ready

function fadeOutModals(){
    $('#add-task-modal').fadeOut();
    $('#delete-confirm-modal').fadeOut();
}

function clearTasksInFields() {
    $('#taskIn').val('');
    $('#dueDateIn').val('');
    $('#completedYN').val('');
    $('#taskCategories').val('');
    $('#notesIn').val('');
} // END clearTasksInFields

function packageNewTask(){
    let newTask = {
        task: $('#taskIn').val(),
        dueDate: $('#dueDateIn').val(),
        completed: $('#completedYN').val(),
        category: $('#taskCategories').val(),
        notes: $('#notesIn').val(),
    };
    console.log($('#completedYN').val());
    

    return newTask;
} // END packageNewTask

function validateTask(newTask){
    let isValid = true;
    let keys = Object.keys(newTask);
    keys.pop('notes');
    for (let i = 0; i < keys.length; i++) {
        if (newTask[keys[i]] === null || newTask[keys[i]].length === 0) {
            isValid = false;
            alert('NO')
            break;
        }
    }
    if (isValid) {
        sendTask(newTask);
        clearTasksInFields()
    }
} // END validateTask

function sendTask(taskObj){
    $.ajax({
        type: 'POST',
        url: '/tasks/add',
        data: taskObj,
    }).done( (response) => {
        console.log('response from /tasks/add POST', response);
        getTasks()
    }).fail( (error) => {
        console.log(error);
    }); // END ajax /tasks/add POST      
} // END sendTask

function getTasks(){
    $.ajax({
        type: 'GET',
        url: 'tasks/get-all'
    }).done( (response) => {
        console.log(response);
        displayTasks(response)
    }).fail( (error) => {
        console.log(error); 
    }); // END ajax tasks/get-all GET
} // END getTasks

function deleteTask(taskId){
    console.log(taskId);
    $.ajax({
        type: 'DELETE',
        url: `/tasks/delete/${taskId}`
    }).done((response) => {
        console.log(response);
        getTasks();
    }).fail((error) => {
        console.log(error);
    });
} // END deleteTask

function displayTasks(tasks){
    // "tasks" = an array of task objects
    let $tbody = $('#tasks-display'); // tbody = the table body to append to
    $tbody.empty();
    let keys = Object.keys(tasks[0]); // get array of a task object's property keys (presumably all objects will have the same keys so I only need to do this once)
    console.log(keys);

    for(let row = 0; row < tasks.length; row++){
        let $tr = $('<tr>'); // make a new table row for each element in "tasks"
        if (tasks[row].completed) {
            $tr.css({'background-color':'#00aa9955'});
        }  else if (!tasks[row].completed){
            $tr.css({'background-color':'#aaaaaa33'})
        } 
        let notesAbrv = tasks[row].notes.slice(0, 20) + '...';
        for (let col = 1; col < keys.length + 1; col++) { // create a column for each key/sql table column and two more for row/task-specific user controls
            let $td = $('<td>'); // create a new table data element for each key/sql table column
            if (col === keys.length - 1) {
                $td.addClass('task-info-ctl').append($('<button>').addClass('btn complete-btn').data('id', tasks[row].id).text('Complete'));
            } else if (col === keys.length) {
                $td.addClass('task-info-ctl').append($('<button>').addClass('btn delete-btn').data('id', tasks[row].id).text('Delete'));
            } else {
                $td.addClass('task-info').data('type', keys[col]).text(tasks[row][keys[col]]); // give data('type') equal to column header to all table cells
            }
            $tr.append($td);
        }
        $tbody.append($tr);
    }
} // END displayTasks


var date = new Date();
var now = date.toLocaleString();


console.log(now);
















