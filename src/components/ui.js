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
  switchCurrentProject(index) {
    controller.setCurrentProjectIndex(index);
    page.refreshDashboard();
  }
}

const currentProject = {
  refreshTitle() {
    let titleText;
    if(controller.currentProjectIndex < 0) {
      titleText = '';
    } 
    else {
      titleText = controller.renderCurrentProjectTitle();
    }
    
    const currentProjectHeading = document.getElementById('currentProjectTitle');
    
    currentProjectHeading.textContent = titleText;
  },
  clearTasks() {
    const currentProjectTasks = document.getElementById('currentProjectTasks');
    
    currentProjectTasks.innerHTML = '';
  },
  addTasks() {
    if(controller.currentProjectIndex < 0) {
      return;
    }
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
  removeCurrentProject() {
    const currentProjectIndex = controller.currentProjectIndex;

    if(currentProjectIndex >= 0) {
      controller.removeProject(currentProjectIndex);
      this.refreshDashboard();
    }
  },
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
    // stops the form from submitting
    e.preventDefault();
    // accesses the form data for use
    const projectName = createProject.elements['projectName'].value;
    // uses the form data to add a project
    sideBar.addProject(projectName);
    // clears the current form data
    createProject.reset();
    // closes out the modal
    addProjectModalContainer.classList.remove('modalContainer--show');
    // gets a list of the projects in order to switch the current project
    const sidebarProjects = document.querySelectorAll('#sidebarProjects > p');
    // switches the current project to the one we've just created
    sideBar.switchCurrentProject(sidebarProjects.length - 1);
  })

  // Project Settings Button
  const projectSettings = document.getElementById('header-projectSettings');
  const projectSettingsDropdown = document.getElementById('header-projectSettingsDropdown');
  projectSettings.addEventListener('click', () => {
    const display = projectSettingsDropdown.style.display;

    display === 'none' ? projectSettingsDropdown.style.display = 'block' : projectSettingsDropdown.style.display = 'none';
  });

  // Remove Project
  const removeProject = document.getElementById('header-projectSettingsDelete');
  removeProject.addEventListener('click', () => {
    page.removeCurrentProject();
  });
  
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