import {Task} from "./task.js";

export class TasksStorage {
    activeWorkspace = {};
    tasks = [];

    toDoForm = document.querySelector("#task-form");
    toDoFormTitleInput = this.toDoForm.querySelector("#task-title-input");
    toDoFormDateInput = this.toDoForm.querySelector("#task-date-input");
    toDoList = document.querySelector("#tasks-list");

    totalCounter = document.querySelector("#total-tasks");
    toDoCounter = document.querySelector("#todo-tasks");
    completeCounter = document.querySelector("#done-tasks");

    loadTasks() {
        this.activeWorkspace = JSON.parse(localStorage.getItem("active_workspace"));
        this.tasks = JSON.parse(localStorage.getItem("tasks"));

        if (!this.tasks?.length) {
            this.tasks = [];
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        }

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

            if (JSON.stringify( this.activeWorkspace ) === '{}') {
                alert("Please chose a workspace!");
                return;
            }

            const task = new Task(title, date, this.activeWorkspace.id);
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
            element.innerHTML = new Task(task.title, task.date, this.activeWorkspace.id, task.complete, task.id).getHtmlTemplate();

            element.querySelector(".task__actions--delete").addEventListener(
                "click",
                () => this.removeTask(task.id)
            )
            element.querySelector(".check").addEventListener(
                "click",
                e => this.handleStatusChange(task.id, e.target)
            )
            element.querySelector(".task__title").addEventListener(
                "input",
                e => this.updateTitle(task.id, e.target.value)
            )
            element.querySelector(".task__date").addEventListener(
                "input",
                e => this.updateDate(task.id, e.target)
            )

            this.toDoList.appendChild(element);
        })

        this.countTasks()
    }

    removeWorkspaceTasks(workspaceId) {
        this.tasks = this.tasks.filter(task => task.workspace !== workspaceId);
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    handleStatusChange(id, element) {
        const task = this.tasks.find(element => element.id === id);
        task.complete = !task.complete;

        if (element.hasAttribute('checked')) {
            element.removeAttribute('checked');
            element.parentElement.parentElement.classList.remove("task--done");

            if (task.date && new Date(task.date).getTime() < new Date().getTime()) {
                element.parentElement.parentElement.classList.add("task--overdue");
            }
        } else {
            element.setAttribute('checked', true);
            element.parentElement.parentElement.classList.add("task--done");
            element.parentElement.parentElement.classList.remove("task--overdue");
        }

        this.countTasks()
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    updateTitle(id, title) {
        this.tasks.find(task => task.id === id).title = title;
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    updateDate(id, element) {
        const task = this.tasks.find(task => task.id === id);
        task.date = element.value;
        task.overdue = !task.complete
            && element.value
            && new Date(element.value).getTime() < new Date().getTime()

        task.overdue
            ? element.parentElement.classList.add('task--overdue')
            : element.parentElement.classList.remove('task--overdue');

        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    removeTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        localStorage.setItem("tasks", JSON.stringify(this.tasks));

        this.displayTasks(this.tasks.filter(task => task.workspace === this.activeWorkspace.id));
    }

    countTasks() {
        const taskCounter = this.tasks
            .filter(task => task.workspace === this.activeWorkspace.id)
            .reduce((counter, task) => {
                task.complete ? counter.complete += 1 : counter.toDo += 1;
                counter.total += 1;

                return counter;
            }, {total: 0, toDo: 0, complete: 0});

        this.totalCounter.innerHTML = taskCounter.total;
        this.toDoCounter.innerHTML = taskCounter.toDo;
        this.completeCounter.innerHTML = taskCounter.complete;
    }
}