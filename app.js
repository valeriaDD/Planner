"use strict";


import {WorkspacesStorage } from "./js/workspaceStorage.js";


const addWorkplace = document.querySelector("#add-workspace");

const toDoForm = document.querySelector("#task-form");
const toDoList = document.querySelector("#tasks-list");

const totalTasksCounter = document.querySelector("#total-tasks");
const toDoTasksCounter = document.querySelector("#todo-tasks");
const completeTasksCounter = document.querySelector("#done-tasks");

const workspaceStorage = new WorkspacesStorage();

window.addEventListener('load', () => {
    workspaceStorage.loadWorkplaces();
})

addWorkplace.addEventListener(
    'click',
    () => workspaceStorage.addWorkspace()
)
