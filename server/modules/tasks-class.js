class Task {
    constructor(id, category, task, notes, dateAdded, dueDate, daysRemaining, completed){
        this.id = id;
        this.category = category;
        this.task = task;
        this.notes = notes;
        this.dateAdded = new Date(dateAdded).toDateString();
        this.dueDate = dueDate.toDateString();
        this.daysRemaining = daysRemaining;
        if(completed === 'true'){
            this.completed = true;
        } else {
            this.completed = false;
        }
    } // END constructor
    
}; // END Task

function processTasks(rows) {
    let tasksArray = [];
    for (let i = 0; i < rows.length; i++) {
        let task = new Task(rows[i].id, rows[i].category, rows[i].task, rows[i].notes, rows[i].date_added, rows[i].due_date, rows[i].date_part, rows[i].completed);
        tasksArray.push(task);
    }
    return tasksArray
}

module.exports = {
    Task: Task,
    processTasks: processTasks,
};