import {Task} from "./task.js";

export class TasksStorage {
    activeWorkspace = {}
    tasks = []
    totalTasksCounter = 0;
    toDoTasksCounter = 0;
    completeTasksCounter = 0;

    toDoForm = document.querySelector("#task-form");
    toDoFormTitleInput = this.toDoForm.querySelector("#task-title-input");
    toDoFormDateInput = this.toDoForm.querySelector("#task-date-input");
    toDoList = document.querySelector("#tasks-list");

    total = document.querySelector("#total-tasks");
    toDo = document.querySelector("#todo-tasks");
    complete = document.querySelector("#done-tasks");

    loadTasks() {
        this.activeWorkspace = JSON.parse(localStorage.getItem("active_workspace"));
        this.tasks = JSON.parse(localStorage.getItem("tasks"));

        if (!this.tasks?.length) {
            this.tasks = [];
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        }

        this.enableTaskForm();
        this.displayTasks(this.tasks.filter(task => task.workspace === this.activeWorkspace.id));
    }

    enableTaskForm() {
        this.toDoForm.addEventListener('submit', e => {
            e.preventDefault()
            this.activeWorkspace = JSON.parse(localStorage.getItem("active_workspace"));
            const title = this.toDoFormTitleInput.value;
            const date = this.toDoFormDateInput.value;

            if (!title) {
                alert("Please enter the title!");
                return;
            }

            const task = new Task(this.activeWorkspace.id, title, date);
            this.tasks.push(task)
            localStorage.setItem("tasks", JSON.stringify(this.tasks))

            this.toDoForm.reset();
            this.displayTasks(this.tasks.filter(task => task.workspace === this.activeWorkspace.id))
        })
    }

    displayTasks(tasks) {
        this.toDoList.innerHTML = ``;

        tasks.sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        ).forEach(task => {
            const element = document.createElement('div')
            element.innerHTML = new Task(this.activeWorkspace.id, task.title, task.date, task.complete).getHtmlTemplate();
            this.toDoList.appendChild(element);
        })
    }
}