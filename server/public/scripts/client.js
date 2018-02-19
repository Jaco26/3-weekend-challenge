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

    $('#tasks-display').on('click', '.complete-btn', function(){
        let id = $(this).data('id');
        completeTask(id);
    }); // END .complete-btn onclick

    $('#tasks-display').on('click', '.redo-btn', function(){
        const taskId = $(this).data('id');
        reOpenTask(taskId)
    }); // END .redo-btn onclick

    $('#tasks-display').on('mouseenter', 'tr', function(e){
        if(!e.target.matches('.task-info-ctl'))
        $(this).children('.task-info').fadeTo(100, 0.8).css({ 'cursor': 'pointer'});
    }); // END tr mouseenter

    $('#tasks-display').on('mouseleave', 'tr', function () {
        $(this).children().fadeTo('fast', 1).css({'font-weight': 'normal' });
    }); // END tr mouseleave

    $('#tasks-display').on('click', 'tr', function (e) {
        if (!e.target.matches('.task-info-ctl') && !e.target.matches('.delete-btn') && !e.target.matches('.complete-btn') && !e.target.matches('.redo-btn')){
            let tableRow = $(this).attr('id');
            let taskId = $(this).data('id');
            $('#edit-task-modal').fadeIn();
            prepareForEdit(tableRow, taskId)
        }
    }); // END tr onclick

    $('.modal-content-c').on('click', '.submitEdit', function(){
        let id = $(this).data('id');
        updateTask(id);
        fadeOutModals();
    }); // END .submitEdit onclick

}); // END document.ready


// =========== ============ ================ =============
// THESE FUNCTIONS DEAL WITH PACKING DATA TO BE SENT
// =========== ============ ================ =============
function packageNewTask(){
    let newTask = {
        task: $('#taskIn').val(),
        dueDate: $('#dueDateIn').val(),
        category: $('#taskCategories').val(),
        notes: $('#notesIn').val(),
    };
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


// =========== ============ ================ =============
// THESE FUNCTIONS DEAL WITH AJAX
// =========== ============ ================ =============
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
} // END sendTask POST

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
} // END getTasks GET

function completeTask(id){
    $.ajax({
        type: 'PUT',
        url: `/tasks/complete/${id}`,
        data: {completed: true},
    }).done((response) => {
        console.log(response);
        getTasks()
    }).fail((error) => {
        console.log(error);
    });
} // END completeTask PUT

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
} // END deleteTask DELETE

function reOpenTask(id){
    $.ajax({
        type: 'PUT',
        url: `/tasks/re-open/${id}`,
        data: {completed: false},
    }).done((response) => {
        console.log(response);
        getTasks();
    }).fail((error) => {
        console.log(error);
    });
}; // END reOpenTask PUT


// =========== ============ ================ =============
// THEES FUNCTIONS DEAL WITH DOM DISPLAY
// =========== ============ ================ =============
function displayTasks(tasks){
    // "tasks" = an array of task objects
    let $tbody = $('#tasks-display'); // tbody = the table body to append to
    $tbody.empty();
    let keys = Object.keys(tasks[0]); // get array of a task object's property keys (presumably all objects will have the same keys so I only need to do this once)
    for(let row = 0; row < tasks.length; row++){
        tasks[row].dueDate = formatDate(tasks[row].dueDate); // Format the dates with my function ...
        tasks[row].dateAdded = formatDate(tasks[row].dateAdded); // Format the dates with my function ...
        let $tr = $('<tr>').data('id', tasks[row].id).attr('id', `tr${row+1}`); // make a new table row for each element in "tasks"
        for (let col = 1; col < keys.length + 1; col++) { // create a column for each key/sql table column and two more for row/task-specific user controls
            let $td = $('<td>'); // create a new table data element for each key/sql table column
            if (col === keys.length - 1) {
                if(tasks[row].completed === true){
                    $td.addClass('task-info-ctl').append($('<button>').addClass('btn redo-btn').data('id', tasks[row].id).text('Re-do'));
                } else {
                    $td.addClass('task-info-ctl').append($('<button>').addClass('btn complete-btn').data('id', tasks[row].id).text('Complete'));
                }
            } else if (col === keys.length) {
                $td.addClass('task-info-ctl').append($('<button>').addClass('btn delete-btn').data('id', tasks[row].id).text('Delete'));
            } else {
                $td.addClass('task-info').addClass(keys[col]).text(tasks[row][keys[col]]); // give data('type') equal to column header to all table cells
            }
            $tr.append($td);
        } 
        if (tasks[row].completed === false && tasks[row].daysRemaining < 2) {
            $tr.children('.task-info').addClass('due-soon');
        } 
        if (tasks[row].completed === false && tasks[row].daysRemaining < 0){
            $tr.children('.task-info').addClass('overdue');
        }
        if (tasks[row].completed === true) {
            $tr.children('.task-info').addClass('completed');
        } else if (tasks[row].completed === false) {
            $tr.children('.task-info').addClass('not-completed')
        } 
        $tr.children('.task-info-ctl').css('background-color', '#33333333');
        $tbody.append($tr);
    }
} // END displayTasks

function clearTasksInFields() {
    $('#taskIn').val('');
    $('#dueDateIn').val('');
    $('#completedYN').val('');
    $('#taskCategories').val('');
    $('#notesIn').val('');
} // END clearTasksInFields

function fadeOutModals() {
    $('#add-task-modal').fadeOut();
    $('#delete-confirm-modal').fadeOut();
    $('#edit-task-modal').fadeOut();
}



// =========== ============ ================ =============
// THESE FUNCTIONS DEAL WITH EDITING TASKS ONCE ON THE DOM
// =========== ============ ================ =============
function formatDate(string){
    // string will look something like "Feb 18 2018"
    let month;
    let mo = string.slice(1, 4);
    if (mo === 'Jan'){
        month = '01';
    } else if (mo === 'Feb') {
        month = '02';
    } else if (mo === 'Mar') {
        month = '03';
    } else if (mo === 'Apr') {
        month = '04';
    } else if (mo === 'May') {
        month = '05';
    } else if (mo === 'Jun') {
        month = '06';
    } else if (mo === 'Jul') {
        month = '07';
    } else if (mo === 'Aug') {
        month = '08';
    } else if (mo === 'Sep') {
        month = '09';
    } else if (mo === 'Oct') {
        month = '10';
    } else if (mo === 'Nov') {
        month = '11';
    } else if (mo === 'Dec') {
        month = '12';
    }
    return [string.slice(8, 12), '-', month, '-', string.slice(5, 7)].join('');
} // END formatDate

function prepareForEdit(row, id) {
    let category = $(`#${row} .category`).text();
    let task = $(`#${row} .task`).text();
    let notes = $(`#${row} .notes`).text();
    let dueDate = $(`#${row} .dueDate`).text();
    $('.modal-content-c').empty().append($('<label for="editCategory">Edit category</label>').append($('<select>').attr({ 'id': 'editCategory' }).val(category)
        .append($('<option value="" disabled selected>Choose a category</option>'),
            $('<option value="house">House</option>'),
            $('<option value="school">School</option>'))));
    $('.modal-content-c').append($('<label for="editTask">Edit task</label><input type="text" id="editTask">').val(task));
    $('.modal-content-c').append(('<label for="editDueDate">Edit due date</label><input type="date" id="editDueDate" value="'+dueDate+'">'));
    $('.modal-content-c').append(('<label for="editNotes">Edit notes</label><textarea id="editNotes" cols="40" rows="5" value="'+notes+'"></textarea>'));
    $('.modal-content-c').append($('<button>').addClass('btn btn-primary submitEdit').text('Submit').data('id', id), $('<button>').addClass('btn btn-light cancelEdit').text('Cancel'));
} // END prepareForEdit()

function updateTask(id) {
    let update = {
        task: $('#editTask').val(),
        dueDate: $('#editDueDate').val(),
        category: $('#editCategory').val(),
        notes: $('#editNotes').val(),
    };
    validateEdit(update, id);
} // END updateTask

function validateEdit(editedTask, id){
    let isValid = true;
    let keys = Object.keys(editedTask);
    keys.pop('notes');
    for (let i = 0; i < keys.length; i++) {
        if (editedTask[keys[i]] === null || editedTask[keys[i]].length === 0) {
            isValid = false;
            alert('NO')
            break;
        }
    } 
    if(isValid){
        $.ajax({
            type: 'PUT',
            url: `/tasks/edit/${id}`,
            data: editedTask,
        }).done((response) => {
            console.log(response);
            getTasks();
        }).fail((error) => {
            console.log(error);
        });
    }; // END
}; // END validateEdit









