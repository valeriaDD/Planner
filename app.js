"use strict";

const addWorkplace = document.querySelector("#add-workspace");

const toDoForm = document.querySelector("#task-form");
const toDoList = document.querySelector("#tasks-list");

const totalTasksCounter = document.querySelector("#total-tasks");
const toDoTasksCounter = document.querySelector("#todo-tasks");
const completeTasksCounter = document.querySelector("#done-tasks");

class Workplace {
    id = undefined;
    title = undefined

    constructor(id = undefined, title = undefined) {
        this.id = id ?? localStorage.getItem('tasks')
            ? JSON.parse(localStorage.getItem('tasks')).length
            : 0
        this.title = title ?? "Untitled" + this.id;
    }

    get() {
        return {
            "id": this.id,
            "title": this.title
        }
    }

    getHtmlTemplate() {
        return `
        <div class="workspace">
            ${this.title}
            <i class="workspace__delete-action bi bi-x"></i>
        </div> 
        `
    }
}

class WorkspacesStorage {
    workplaces = [];

    workspacesList = document.querySelector("#workspaces-list");

    loadWorkplaces() {
        this.workplaces = JSON.parse(localStorage.getItem("tasks"));

        if (!this.workplaces?.length) {
            this.workplaces = [new Workplace()];
            localStorage.setItem("tasks", JSON.stringify(this.workplaces))
        }

        this.displayWorkplaces()
    }

    displayWorkplaces() {
        this.workspacesList.innerHTML = ``;

        this.workplaces.forEach(workplace => {
                const element = document.createElement('div')
                element.innerHTML = new Workplace(workplace.id, workplace.title).getHtmlTemplate();
                element.addEventListener('click', () => this.removeWorkspace(workplace.id))
                this.workspacesList.appendChild(element);
            }
        )
    }

    addWorkspace() {
        this.workplaces.push(new Workplace());
        localStorage.setItem("tasks", JSON.stringify(this.workplaces));

        this.displayWorkplaces();
    }

    removeWorkspace(id) {
        this.workplaces = this.workplaces.filter(workplace => workplace.id !== id);
        localStorage.setItem("tasks", JSON.stringify(this.workplaces));

        this.displayWorkplaces();
    }
}

const workspaceStorage = new WorkspacesStorage();

window.addEventListener('load', () => {
    workspaceStorage.loadWorkplaces();
})

addWorkplace.addEventListener(
    'click',
    () => workspaceStorage.addWorkspace()
)
