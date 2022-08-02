import {controller, model, view} from './mvc/mvc.js';

export {UI};

const sideBar = {
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
    dynamicEventListeners.sidebarProjects();
  },
  addProject(name) {
    controller.addProject(name);
    this.refreshSidebarProjects();
  },
  removeProject(index) {
    controller.removeProject(index);
    this.refreshSidebarProjects();
  },
  switchCurrentProject(index) {
    controller.setCurrentProjectIndex(index);
    refreshDashboard();
  }
}

const currentProject = {
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
}

function refreshDashboard() {
      sideBar.refreshSidebarProjects();
      currentProject.refreshCurrentProject();
}

const UI = {sideBar, currentProject, refreshDashboard};

// ~~~~~~~~~~~~~~~T E S T I N G   B E L O W~~~~~~~~~~~~~~ //
// will eventually be transferred to index.js once UI has the corresponding addProject and addProjectTask functions

controller.addProject('My Project 1');

controller.addCurrentProjectTask('fight fires','carefully',['clean room', 'do stuff'],'to-do');
controller.addCurrentProjectTask('hi','hi',['pet da cat'],'to-do');


controller.addProject('My Project 2');

controller.addCurrentProjectTask('pet cats','carefully',['clean room', 'do stuff'],'to-do');
controller.addCurrentProjectTask('hi','hi',['pet da cat'],'to-do');


controller.addProject('My Project 3');

controller.addCurrentProjectTask('hi','hi',['clean room', 'do stuff'],'to-do');
controller.addCurrentProjectTask('hi','hi',['pet da cat'],'to-do');

// ---------------Dynamic Event Listeners---------- //
const dynamicEventListeners = {
    sidebarProjects : () => {
        const sidebarProjects = document.querySelectorAll('#sidebarProjects > p');
    sidebarProjects.forEach((p) => {
      p.addEventListener('click', () => {
        sideBar.switchCurrentProject(p.dataset.index);
      })
    });
    }
}

// ---------------Static Event Listeners---------- //
// Modal
const addNewTask = document.getElementById('header-addNewTask');
const modalContainer = document.getElementById('modalContainer');
addNewTask.addEventListener('click', () => {
  modalContainer.classList.add('show');
});
modalContainer.addEventListener('click', (e) => {
  if(e.target.classList.contains("modalContainer")) {
    modalContainer.classList.remove('show');
  }
});