import {controller, model, view} from './mvc/mvc.js';

export {UI};

const sideBar = {
  clearProjects() {
    const sidebarProjects = document.getElementById('sidebarProjects');
    
    sidebarProjects.innerHTML = '';
  },
  addProjects() {
    const projectElements = controller.renderProjects();
    
    const sidebarProjects = document.getElementById('sidebarProjects');
    projectElements.forEach(element => {
      sidebarProjects.appendChild(element);
    });
  },
  refreshProjects() {
    this.clearProjects();
    this.addProjects();
    dynamicEventListeners.sidebarProjects();
  },
  addProject(name) {
    controller.addProject(name);
    this.refreshProjects();
  },
  removeProject(index) {
    controller.removeProject(index);
    this.refreshProjects();
  },
  switchCurrentProject(index) {
    controller.setCurrentProjectIndex(index);
    page.refreshDashboard();
  }
}

const currentProject = {
  refreshTitle() {
    const titleText = controller.renderCurrentProjectTitle();
    
    const currentProjectHeading = document.getElementById('currentProjectTitle');
    
    currentProjectHeading.textContent = titleText;
  },
  clearTasks() {
    const currentProjectTasks = document.getElementById('currentProjectTasks');
    
    currentProjectTasks.innerHTML = '';
  },
  addTasks() {
    const taskElements = controller.renderCurrentProjectTasks();
    
    const projectTasks = document.getElementById('currentProjectTasks');
   
    taskElements.forEach((element) => {
      projectTasks.appendChild(element);
    });
  },
  refreshTasks() {
    this.clearTasks();
    this.addTasks();
  },
  refresh() {
    this.refreshTitle();
    this.refreshTasks();
  },
}

const page = {
  refreshDashboard() {
    sideBar.refreshProjects();
    currentProject.refresh();
}
}

const UI = {sideBar, currentProject, page, staticEventListeners};

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

function staticEventListeners() {
  // Add New Task Button
  const addNewTask = document.getElementById('header-addNewTask');
  addNewTask.addEventListener('click', () => {
    addTaskModalContainer.classList.add('modalContainer--show');
  });

  // Add New Task Modal
  const addTaskModalContainer = document.getElementById('addTaskModalContainer');
  addTaskModalContainer.addEventListener('click', (e) => {
    if(e.target.classList.contains("addTaskModalContainer")) {
      addTaskModalContainer.classList.remove('modalContainer--show');
    }
  });

  // Add New Project Button
  const addNewProject = document.getElementById('sidebarNewProject');
  addNewProject.addEventListener('click', () => {
    addProjectModalContainer.classList.add('modalContainer--show');
  })

  // Add New Project Modal
  const addProjectModalContainer = document.getElementById('addProjectModalContainer');
  addProjectModalContainer.addEventListener('click', (e) => {
    if(e.target.classList.contains("addProjectModalContainer")) {
      addProjectModalContainer.classList.remove('modalContainer--show');
    }
  });

  // Add New Project Submission
  const createProject = document.getElementById('createProject');
  createProject.addEventListener('submit', (e) => {
    e.preventDefault();
    const projectName = createProject.elements['projectName'].value;

    sideBar.addProject(projectName);
  })
}

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