"use strict";


import {WorkspacesStorage } from "./js/workspaceStorage.js";
import {TasksStorage} from "./js/tasksStorage.js";


const addWorkplace = document.querySelector("#add-workspace");

const workspaceStorage = new WorkspacesStorage();
const tasksStorage = new TasksStorage();

window.addEventListener('load', () => {
    workspaceStorage.loadWorkplaces().then(() => tasksStorage.loadTasks());
})

addWorkplace.addEventListener(
    'click',
    () => workspaceStorage.addWorkspace()
)
