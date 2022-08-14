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
      const taskCategories = document.querySelectorAll('#currentProject-tasks > div > div');
      
      taskCategories.forEach((element) => {
        element.innerHTML = '';
      });
    },
    add() {
      if(controller.currentProjectIndex < 0) {
        return;
      }
      const taskElements = controller.renderCurrentProjectTaskCards();
      
      const toDoCategory = document.getElementById('currentProject-tasks-toDoTaskContainer');
      const doingCategory = document.getElementById('currentProject-tasks-doingTaskContainer');
      const doneCategory = document.getElementById('currentProject-tasks-doneTaskContainer');
      
      taskElements.forEach((element) => {
        const status = element.dataset.status;
        
        if(status === 'To-Do') {
          toDoCategory.appendChild(element);
        }
        else if(status === 'Doing') {
          doingCategory.appendChild(element);
        }
        if(status === 'Done') {
          doneCategory.appendChild(element);
        }
      });
    },
    eventListeners() {
      const tasks = document.querySelectorAll('#currentProject-tasks > div > div > div');
      
      const modalContainer = document.getElementById('taskViewModalContainer');
      const modal = document.getElementById('taskView');

      tasks.forEach(task => {
        task.addEventListener('click', () => {
          modalContainer.classList.add('modalContainer--show');


          const taskIndex = task.dataset.index;
          
          const modalElements = controller.renderCurrentProjectTaskModal(taskIndex);

          const options = Array.from(modalElements.dropdownStatus.getElementsByTagName('option'));
          const taskStatus = controller.getCurrentProjectTaskStatus(taskIndex);
          options.forEach(option => {
            if(option.value === taskStatus) {
              option.selected = true;
            }
          });

          modal.appendChild(modalElements.topContent);
          modal.appendChild(modalElements.taskDescription);
          modal.appendChild(modalElements.subtasksContainer);
          modal.appendChild(modalElements.dropdownStatus);

          const subtaskCheckboxes = document.querySelectorAll('#taskViewSubtasksContainer > div > input');

          subtaskCheckboxes.forEach((checkbox, subtaskIndex) => {
            checkbox.addEventListener('click', () => {
              controller.toggleCurrentProjectSubtaskStatus(taskIndex, subtaskIndex);
              this.refresh();
            });
          });

          const dropdown = document.querySelector('#taskView > select');
          dropdown.addEventListener('change', () => {
            controller.setCurrentProjectTaskStatus(dropdown.value, taskIndex);
            currentProject.refresh();
          });

          const deleteButton = document.getElementById('taskView-dropdownDeleteButton');
          deleteButton.addEventListener('click', function(){
            currentProject.deleteTask(this.dataset.index);

            const dropdown = document.getElementById('taskView-dropdown');
            dropdown.style.display = 'none';

            const modalContainer = document.getElementById('taskViewModalContainer');
            modalContainer.classList.toggle('modalContainer--show');

            const modal = document.getElementById('taskView');
            modal.innerHTML = '';
          });
        });
      })
    },
    refresh() {
      this.clear();
      this.add();
      this.eventListeners();
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
  },
  deleteTask(taskIndex) {
    controller.removeCurrentProjectTask(taskIndex);
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

  // Add New Task Modal Closer
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

  // Add New Project Modal Closer
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

    display === 'none' 
      ? projectSettingsDropdown.style.display = 'block' 
      : projectSettingsDropdown.style.display = 'none';
  });

  // Remove Project
  const removeProject = document.getElementById('header-projectSettingsDelete');
  removeProject.addEventListener('click', () => {
    page.removeCurrentProject();
  });
  
  // Task View Modal Closer
  const taskViewModalContainer = document.getElementById('taskViewModalContainer');
  taskViewModalContainer.addEventListener('click', (e) => {
    if(e.target.classList.contains("taskViewModalContainer")) {
      taskViewModalContainer.classList.remove('modalContainer--show');

      document.getElementById('taskView').innerHTML = '';
    }
  });
}

function loadFromLocalStorage() {
  controller.loadFromLocalStorage();
  page.switchCurrentProject(0);
  page.refreshDashboard();
}

// HERE
const UI = {sideBar, currentProject, page, staticEventListeners, loadFromLocalStorage};