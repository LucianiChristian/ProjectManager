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

    changeStatusToDo() {
      this.status = 'To-Do';
    }

    changeStatusDoing() {
      this.status = 'Doing';
    }

    changeStatusDone() {
      this.status = 'Done';
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
  constructor(title, complete) {
    this.title = title;

    if(complete !== undefined) {
     this.complete = complete; 
    }
    else {
      this.complete = false;
    }
  }
  
  toggleComplete() {
      this.complete === false ? this.complete = true : this.complete = false; 
  }
}