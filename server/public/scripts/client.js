$(document).ready(function() {
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
        console.log(newTask);
        sendTask(newTask);
       // clearTasksInFields()   
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
        // getTasks()
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
        // displayTasks()
    }).fail( (error) => {
        console.log(error); 
    }); // END ajax tasks/get-all GET
} // END getTasks

function displayTasks(){

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
