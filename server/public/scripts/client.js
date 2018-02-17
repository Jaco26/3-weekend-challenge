$(document).ready(function() {
    getTasks();
    $('#submitTask').on('click', packageNewTask);
    
    //$('#add-category').on('click', showAddCategoryModal) // END #taskCategories onchange if add-category
    //$('#submitNewCategory').on('click', addCategoryToDropdown);
}); // END document.ready

function clearTasksInFields() {
    $('#taskIn').val('');
    $('#dueDateIn').val('');
    $('#completedYN').val('No');
} // END clearTasksInFields

function packageNewTask(){
    let newTask = {
        task: $('#taskIn').val(),
        dueDate: $('#dueDateIn').val(),
        completed: $('#completedYN').val(),
        category: $('#taskCategories').val(),
    };
    let isValid = 0;
    let keys = Object.keys(newTask);
    for(let i = 0; i < keys.length; i ++){
        if(newTask[keys[i]].length === 0){
           isValid += 1
        }
    }
    if(isValid > 0){
        alert('NO')
    } else {
        sendTask(newTask);
        clearTasksInFields()   
    }
} // END #submitTask onclick

function sendTask(taskObj){
    console.log(taskObj);
    
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

function displayTasks(tasks){
    // "tasks" = an array of task objects
    let $tbody = $('#tasks-display'); // tbody = the table body to append to
    let keys = Object.keys(tasks[0]); // get array of a task object's property keys (presumably all objects will have the same keys so I only need to do this once)
    for(let row = 0; row < tasks.length; row++){
        let $tr = $('<tr>'); // make a new table row for each element in "tasks"
        if(tasks[row].completed === 'Y'){
            $tr.css('background-color', '#00aa9955');
        }
        for(let col = 0; col < keys.length + 1; col++) { // create a column for each key/sql table column and two more for row/task-specific user controls
            let $td = $('<td>'); // create a new table data element for each key/sql table column

            if(col === keys.length -1){
                $td.append($('<button>').addClass('btn complete-btn').data('id', tasks[row].id).text('Complete'));
            } else if (col === keys.length){
                $td.append($('<button>').addClass('btn delete-btn').data('id', tasks[row].id).text('Delete'));
            }
            $tr.append($td);
        }
        $tbody.append($tr);
    }
    

} // END displayTasks























/*
function showAddCategoryModal(){
    $('.modal').fadeIn();
}; // END showAddCategoryModal

function addCategoryToDropdown(){
    let newCategory = $('#newCategoryIn').val()
    $('#taskCategories').append($('<option>').val(newCategory).text(newCategory));
    $('.modal').fadeOut();
}; // END addCategoryToDropdown
*/
