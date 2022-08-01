import './style.css';

// -------------- Classes.js -------------- //

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

// -------------- Dashboard.js ------------ //
const controller = {
  currentProjectIndex: -1,
  setCurrentProjectIndex(value) {
    if(this.currentProjectIndex === undefined) {
      this.currentProjectIndex = 0;
      return;
    }
    
    this.currentProjectIndex = value;
  },
  addProject(name) {
    this.setCurrentProjectIndex(this.currentProjectIndex + 1);
    model.addProject(name);
  },
  removeProject(index) {
    this.setCurrentProjectIndex(this.currentProjectIndex - 1);
    model.removeProject(index);
  },
  renderProjects() {
    const projectsData = model.getProjects();
    
    const projectElements = view.renderProjects(projectsData);
    
    return projectElements;
  },
  addCurrentProjectTask(name, description, subtasks, status) {
    model.addTask(this.currentProjectIndex, name, description, subtasks, status);
  },
  removeCurrentProjectTask(taskIndex) {
    model.removeTask(this.currentProjectIndex, taskIndex);
  },
  renderCurrentProjectTitle() {
    const titleText = model.getProject(this.currentProjectIndex).name;

    return titleText;
  },
  renderCurrentProjectTasks() {
    const projectData = model.getProject(this.currentProjectIndex);

    const taskElements = view.renderCurrentProjectTasks(projectData);
    
    return taskElements;
  }
}

const model = {
  projects: [],
  addProject: function(name) {
    this.projects.push(new Project(name));
  },
  removeProject: function(index) {
    this.projects.splice(index, 1);
  },
  getProjects: function() {
    const projectsCopy = [...this.projects];
    return projectsCopy;
  },
  getProject: function(projectIndex) {
    return this.projects[projectIndex];
  },
  addTask(currentProjectIndex, name, description, subtasks, status) {
    this.projects[currentProjectIndex].addTask(name, description, subtasks, status);
  },
  removeTask(currentProjectIndex, taskIndex) {
    this.projects[currentProjectIndex].removeTask(taskIndex);
  }
}

const view = {
  renderProjects(projectsData) {
    const projectElements = projectsData.map((project, index) => {
      const p = document.createElement('p');
      p.textContent = project.name;
      p.dataset.index = index;
      
      return p;
    });
    
    return projectElements;
  },
  renderCurrentProjectTitle(titleData) {
    const h2 = document.createElement('h2');
    h2.textContent = titleData;
    
    return h2;
  },
  renderCurrentProjectTasks(currentProjectData) {
    const tasks = currentProjectData.tasks;

    const taskElements = tasks.map(task => {
      const h3 = document.createElement('h3'); 
      h3.textContent = task.title;
      
      const subtaskTotalCount = task.subtasks.length; 
      const subtaskCompletedCount = task.getCompletedSubtaskCount();

      const p = document.createElement('p');
      
      p.textContent = `${subtaskCompletedCount} of ${subtaskTotalCount} subtasks`;
      
      const div = document.createElement('div');
      
      div.appendChild(h3);
      div.appendChild(p);
      
      return div;
    });
    
    return taskElements;
  } 
}


// ---------------Event Listeners---------- //
const eventListeners = {
  sidebarProjects : () => {
      const sidebarProjects = document.querySelectorAll('#sidebarProjects > p');
  sidebarProjects.forEach((p) => {
    p.addEventListener('click', () => {
      UI.switchCurrentProject(p.dataset.index);
    })
  });
  }
}


// ----------------- UI.js ---------------- //
const UI = {
  clearSidebarProjects() {
    const sidebarProjects = document.getElementById('sidebarProjects');
    
    sidebarProjects.innerHTML = '';
  },
  addSidebarProjects() {
    const projectElements = controller.renderProjects();
    
    const sidebarProjects = document.getElementById('sidebarProjects');
    projectElements.forEach(element => {
      sidebarProjects.appendChild(element);
    });
  },
  refreshSidebarProjects() {
    this.clearSidebarProjects();
    this.addSidebarProjects();
  },
  addProject(name) {
    controller.addProject(name);
    this.refreshSidebarProjects();
  },
  removeProject(index) {
    controller.removeProject(index);
    this.refreshSidebarProjects();
  },
  refreshCurrentProjectTitle() {
    const titleText = controller.renderCurrentProjectTitle();
    
    const currentProjectHeading = document.getElementById('currentProjectTitle');
    
    currentProjectHeading.textContent = titleText;
  },
  clearCurrentProjectTasks() {
    const currentProjectTasks = document.getElementById('currentProjectTasks');
    
    currentProjectTasks.innerHTML = '';
  },
  addCurrentProjectTasks() {
    const taskElements = controller.renderCurrentProjectTasks();
    
    const projectTasks = document.getElementById('currentProjectTasks');
   
    taskElements.forEach((element) => {
      projectTasks.appendChild(element);
    });
  },
  refreshCurrentProjectTasks() {
    this.clearCurrentProjectTasks();
    this.addCurrentProjectTasks();
  },
  refreshCurrentProject() {
    this.refreshCurrentProjectTitle();
    this.refreshCurrentProjectTasks();
  },
  refreshDashboard() {
    this.refreshSidebarProjects();
    this.refreshCurrentProject();
    eventListeners.sidebarProjects();
  },
  switchCurrentProject(index) {
    controller.setCurrentProjectIndex(index);
    this.refreshDashboard();
  }
}

// ~~~~~~~~~~~~~~~T E S T I N G   B E L O W~~~~~~~~~~~~~~ //

controller.addProject('My Project 1');

controller.addCurrentProjectTask('fight fires','carefully',['clean room', 'do stuff'],'to-do');
controller.addCurrentProjectTask('hi','hi',['pet da cat'],'to-do');


controller.addProject('My Project 2');

controller.addCurrentProjectTask('pet cats','carefully',['clean room', 'do stuff'],'to-do');
controller.addCurrentProjectTask('hi','hi',['pet da cat'],'to-do');


controller.addProject('My Project 3');

controller.addCurrentProjectTask('hi','hi',['clean room', 'do stuff'],'to-do');
controller.addCurrentProjectTask('hi','hi',['pet da cat'],'to-do');

UI.refreshDashboard();

// ---------------Event Listeners---------- //
// Modal
const addNewTask = document.getElementById('header-addNewTask');
const modalContainer = document.getElementById('modalContainer');
addNewTask.addEventListener('click', () => {
  modalContainer.classList.add('show');
});
modalContainer.addEventListener('click', (e) => {
  if(e.target.classList.contains("modal-container")) {
    modalContainer.classList.remove('show');
  }
});







