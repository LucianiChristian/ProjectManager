export {Project, Task, Subtask};

class Project {
    tasks = [];
    
    constructor(name) {
        this.name = name;
    }
  
    addTask(title, description, subtasks, status) {
        const newTask = new Task(title, description, subtasks, status);
        this.tasks.push(newTask);
    }
    removeTask(index) {
      this.tasks.splice(index, 1);
    }
}

class Task {
    static status = {
      toDo: 'To-Do',
      doing: 'Doing',
      done: 'Done'
    }
 
    constructor(title, description, subtasks, status) {
        this.title = title;
        this.description = description;
        this.subtasks = subtasks.map(title => {
            return new Subtask(title); 
        });
        this.status = status;
    }
  
    addSubtask(title) {
      this.subtasks.push(new Subtask(title));
    }
  
    removeSubtask(index) {
      this.subtasks.splice(index, 1);
    }
  
    changeStatus(status) {
      this.status = status;
    }
  
    getCompletedSubtaskCount() {
      let count = 0;
      
      this.subtasks.forEach(subtask => {
        if(subtask.complete) {
          count++;
        }
      });
      
      return count;
    }
}

class Subtask {
  constructor(title) {
    this.title = title;
    this.complete = false;
  }
  
  toggleComplete() {
      this.complete === false ? this.complete = true : this.complete = false; 
  }
}