"use strict";


import {WorkspacesStorage } from "./js/workspaceStorage.js";
import {TasksStorage} from "./js/tasksStorage.js";


const addWorkplace = document.querySelector("#add-workspace");

const workspaceStorage = new WorkspacesStorage();
const tasksStorage = new TasksStorage();

window.addEventListener('load', () => {
    workspaceStorage.loadWorkplaces().then(() => tasksStorage.loadTasks());
    tasksStorage.enableTaskForm();
})

window.addEventListener('activeWorkspaceUpdated', () => {
    tasksStorage.loadTasks();
})

window.addEventListener('workspaceDeleted', e => {
    tasksStorage.removeWorkspaceTasks(e.detail);

    if (!workspaceStorage.hasActiveWorkspace()) {
        tasksStorage.displayTasks([])
        workspaceStorage.updateActiveWorkplaceHtml("Pick a workspace!")
    }
})

addWorkplace.addEventListener(
    'click',
    () => workspaceStorage.addWorkspace()
)
