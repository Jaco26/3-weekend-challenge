class Task {
    constructor(id, category, task, dateAdded, dueDate, completed){
        this.id = id;
        this.category = category;
        this.task = task;
        this.dateAdded = new Date(dateAdded).toDateString();
        this.dueDate = dueDate.toDateString();
        if(completed === 'N'){
            this.completed = false;
        } else {
            this.completed = true;
        }
    } // END constructor

    
}; // END Task

function processTasks(rows) {
    let tasksArray = [];
    for (let i = 0; i < rows.length; i++) {
        let task = new Task(rows[i].id, rows[i].category, rows[i].task, rows[i].date_added, rows[i].due_date, rows[i].completed);
        tasksArray.push(task);
    }
    return tasksArray
}

module.exports = {
    Task: Task,
    processTasks: processTasks
};