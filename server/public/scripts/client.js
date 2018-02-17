$(document).ready(function() {
    $('#submitTask').on('click', packageNewTask);
}); // END document.ready

function packageNewTask(){
    let newTask = {task: $('#taskIn').val(), dueDate: $('#dueDateIn').val(), completed: $('#completedYN').val()};
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
        console.log(newTask);
        // sendTask(newTask);
        clearTasksInFields()   
    }
} // END #submitTask onclick

function sendTask(taskObj){
    $.ajax()
} // END sendTask

function clearTasksInFields(){
    $('#taskIn').val('');
    $('#dueDateIn').val('');
    $('#completedYN').val('no')
}