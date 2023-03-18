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

    getHtmlTemplate() {
        return `
            <div class="workspace">
               <input class="workplace__input" value="${this.title}">
                <i class="workspace__delete-action bi bi-x"></i>
            </div> 
        `
    }
}

class WorkspacesStorage {
    activeWorkplace = {}
    workplaces = [];

    workspacesList = document.querySelector("#workspaces-list");

    loadWorkplaces() {
        this.workplaces = JSON.parse(localStorage.getItem("tasks"));
        this.activeWorkplace = JSON.parse(localStorage.getItem("active_workspace"))

        if (!this.workplaces?.length) {
            this.workplaces = [new Workplace()];
            localStorage.setItem("tasks", JSON.stringify(this.workplaces))
        }


        if (!this.activeWorkplace) {
            this.activeWorkplace = this.workplaces[0];
            localStorage.setItem("active_workspace", JSON.stringify(this.activeWorkplace))
        }

        this.displayWorkplaces()
    }

    displayWorkplaces() {
        this.workspacesList.innerHTML = ``;

        this.workplaces.forEach(workplace => {
                const element = document.createElement('div')
                element.innerHTML = new Workplace(workplace.id, workplace.title).getHtmlTemplate();

                if (this.activeWorkplace?.id === workplace.id) {
                    element.querySelector(".workspace").classList.add('workspace--active');
                }


                element.querySelector(".workplace__input").addEventListener(
                    'input',
                    e => this.updateWorkspace(workplace, e.target.value)
                )
                element.addEventListener(
                    'click',
                    () => this.setActiveWorkspace(workplace, element)
                )
                element.querySelector('.workspace__delete-action').addEventListener(
                    "click",
                    () => this.removeWorkspace(workplace.id)
                )


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

        if (this.activeWorkplace.id === id) {
            this.activeWorkplace = {};
            localStorage.setItem("active_workspace", JSON.stringify(this.activeWorkplace))
        }

        this.displayWorkplaces();
    }

    updateWorkspace(workplace, title) {
        let element = this.workplaces.find(element => element.id === workplace.id)
        element.title = title;

        localStorage.setItem("tasks", JSON.stringify(this.workplaces));

        if (this.activeWorkplace.id === workplace.id) {
            this.activeWorkplace.title = title;
            localStorage.setItem("active_workspace", JSON.stringify(this.activeWorkplace))
        }
    }

    setActiveWorkspace(workplace, element) {
        this.activeWorkplace = workplace;

        localStorage.setItem("active_workspace", JSON.stringify(workplace))
        let activeElements = document.getElementsByClassName("workspace--active");

        if (activeElements.length > 0) {
            activeElements[0].classList.remove("workspace--active");
        }

        element.querySelector(".workspace").classList.add('workspace--active');
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
