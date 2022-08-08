import {controller, model, view} from './mvc/mvc.js';

export {UI};

const sideBar = {
  projectTitles: {
    clear() {
      const sidebarProjects = document.getElementById('sidebarProjects');
      
      sidebarProjects.innerHTML = '';
    },
    add() {
      const projectElements = controller.renderProjects();
      
      const sidebarProjects = document.getElementById('sidebarProjects');
      projectElements.forEach(element => {
        sidebarProjects.appendChild(element);
      });
    },
    eventListeners() {
      const sidebarProjects = document.querySelectorAll('#sidebarProjects > p');

      sidebarProjects.forEach((p) => {
          p.addEventListener('click', () => {
          page.switchCurrentProject(p.dataset.index);
        })});
    },
    refresh() {
      this.clear();
      this.add();
      this.eventListeners();
    },
  },
  createNewProject(name) {
    controller.addProject(name);
    this.projectTitles.refresh();
  },
}

const currentProject = {
  tasks: {
    clear() {
      const currentProjectTasks = document.getElementById('currentProjectTasks');
      
      currentProjectTasks.innerHTML = '';
    },
    add() {
      if(controller.currentProjectIndex < 0) {
        return;
      }
      const taskElements = controller.renderCurrentProjectTasks();
      
      const projectTasks = document.getElementById('currentProjectTasks');
     
      taskElements.forEach((element) => {
        projectTasks.appendChild(element);
      });
    },
    refresh() {
      this.clear();
      this.add();
    },
  },
  title: {
    refresh() {
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
  },
  refresh() {
    this.title.refresh();
    this.tasks.refresh();
  },
  createNewTask(title, description, subtasks, status) {
    controller.addCurrentProjectTask(title, description, subtasks, status);
    this.refresh();
  }
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
    sideBar.projectTitles.refresh();
    currentProject.refresh();
  },
  switchCurrentProject(index) {
    controller.setCurrentProjectIndex(index);
    page.refreshDashboard();
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

  // Add New Task Add New Subtask
  const addNewSubtask = document.getElementById('addNewSubtask');
  addNewSubtask.addEventListener('click', () => {
    const div = document.createElement('div');
    div.classList.add('addTaskModal__subtask');

    const input = document.createElement('input');
    input.setAttribute('name', 'subtasks');
    input.setAttribute('id', 'subtasks');

    const button = document.createElement('button');
    button.setAttribute('id', 'remove-subtask');
    button.setAttribute('class', 'addTaskModal__subtask-remove');
    button.setAttribute('type', 'button');
    button.textContent = 'x';

    div.appendChild(input);
    div.appendChild(button);

    const subtasksContainer = document.getElementById('subtasksContainer');
    subtasksContainer.append(div);
  });

  // Add New Task Submission
  const createTask = document.getElementById('createTask');
  createTask.addEventListener('submit', (e) => {
    // stops the form from submitting
    e.preventDefault();
    
    // accesses the form data for use
    const title = createTask.elements['title'].value;
    const description = createTask.elements['description'].value;
    
    const subtaskElements = Array.from(document.querySelectorAll('input[name="subtasks"]'));
    const subtasks = subtaskElements.map(subtask => subtask.value);

    const status = createTask.elements['status'].value;
    
    // use the form data to add a task
    currentProject.createNewTask(title, description, subtasks, status);

    // clear current form data
    createTask.reset();

    // closes out the modal
    addTaskModalContainer.classList.remove('modalContainer--show');
  })

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
    sideBar.createNewProject(projectName);
    // clears the current form data
    createProject.reset();
    // closes out the modal
    addProjectModalContainer.classList.remove('modalContainer--show');
    // gets a list of the projects in order to switch the current project
    const sidebarProjects = document.querySelectorAll('#sidebarProjects > p');
    // switches the current project to the one we've just created
    page.switchCurrentProject(sidebarProjects.length - 1);
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

const UI = {sideBar, currentProject, page, staticEventListeners};




































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