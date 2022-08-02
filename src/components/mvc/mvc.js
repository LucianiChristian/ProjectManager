import {Project, Task, Subtask} from './classes.js';

export {controller, model, view};

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