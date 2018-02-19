class Task {
    constructor(id, category, task, notes, dateAdded, dueDate, daysRemaining, completed){
        this.id = id;
        this.category = category;
        this.task = task;
        this.notes = notes;
        this.dateAdded = new Date(dateAdded).toString();
        this.dueDate = dueDate.toString();
        this.daysRemaining = daysRemaining;
        if(completed === 'true'){
            this.completed = true;
        } else if (completed === 'false'){
            this.completed = false;
        }
    } // END constructor
    

}; // END Task

function processTasks(rows) {
    let tasksArray = [];
    for (let i = 0; i < rows.length; i++) {
        let task = new Task(rows[i].id, rows[i].category, rows[i].task, rows[i].notes, rows[i].date_added, rows[i].due_date, rows[i].date_part, rows[i].completed);
        let d = new Date();
        task.dateAdded = task.dateAdded.slice(3, 15);
        task.dueDate = task.dueDate.slice(3, 15);
        if(task.completed){
            tasksArray.push(task);
        } else {
            tasksArray.unshift(task);
        }
        
    }
    return tasksArray
}

module.exports = {
    Task: Task,
    processTasks: processTasks,
};