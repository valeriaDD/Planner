import {Workplace} from "./workspace.js";

export class WorkspacesStorage {
    activeWorkplace = {}
    workplaces = [];

    workspacesList = document.querySelector("#workspaces-list");
    activeWorkspaceTitle = document.querySelector("#active-workspace-title");

    async loadWorkplaces() {
        this.workplaces = JSON.parse(localStorage.getItem("workspaces"));
        this.activeWorkplace = JSON.parse(localStorage.getItem("active_workspace"))

        if (!this.workplaces?.length) {
            this.workplaces = [new Workplace()];
            localStorage.setItem("workspaces", JSON.stringify(this.workplaces))
        }

        if (!this.activeWorkplace) {
            this.activeWorkplace = this.workplaces[0];
            localStorage.setItem("active_workspace", JSON.stringify(this.activeWorkplace))
        }

        this.activeWorkspaceTitle.innerHTML = this.activeWorkplace?.title ?? '';

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

                element.querySelector(".workspace__input").addEventListener(
                    'input',
                    e => this.updateWorkspace(workplace, e.target.value)
                )
                element.addEventListener(
                    'click',
                    (e) => this.setActiveWorkspace(workplace, element, e)
                )
                element.querySelector('.workspace__delete-action').addEventListener(
                    "click",
                    () => this.removeWorkspace(workplace.id)
                )

                this.workspacesList.appendChild(element);
            }
        )

        if (!this.hasActiveWorkspace()) {
            this.updateActiveWorkplaceHtml("Pick a workspace!")
        }
    }

    addWorkspace() {
        this.workplaces.push(new Workplace());
        localStorage.setItem("workspaces", JSON.stringify(this.workplaces));

        this.displayWorkplaces();
    }

    removeWorkspace(id) {
        let confirmResult =
            confirm("Are you sure you want to delete this workspace? This will also delete all its tasks.");

        if(confirmResult) {
            this.workplaces = this.workplaces.filter(workplace => workplace.id !== id);
            localStorage.setItem("workspaces", JSON.stringify(this.workplaces));

            if (this.activeWorkplace.id === id) {
                this.activeWorkplace = {};
                localStorage.setItem("active_workspace", JSON.stringify({}))
            }

            window.dispatchEvent( new CustomEvent("workspaceDeleted", {
                bubbles: true,
                detail: id,
            }));

            this.displayWorkplaces();
        }
    }

    updateWorkspace(workplace, title) {
        let element = this.workplaces.find(element => element.id === workplace.id)
        element.title = title;
        localStorage.setItem("workspaces", JSON.stringify(this.workplaces));

        if (this.activeWorkplace.id === workplace.id) {
            this.activeWorkplace.title = title;
            localStorage.setItem("active_workspace", JSON.stringify(this.activeWorkplace))
            this.updateActiveWorkplaceHtml()
        }
    }

    setActiveWorkspace(workplace, element, event) {
        if (event.target.classList.contains('workspace__delete-action')) {
            return;
        }

        this.activeWorkplace = workplace;
        localStorage.setItem("active_workspace", JSON.stringify(workplace))

        window.dispatchEvent( new CustomEvent("activeWorkspaceUpdated", {
            bubbles: true,
        }));

        let activeElements = document.getElementsByClassName("workspace--active");
        if (activeElements.length > 0) {
            activeElements[0].classList.remove("workspace--active");
        }

        element.querySelector(".workspace").classList.add('workspace--active');
        this.updateActiveWorkplaceHtml()
    }

    updateActiveWorkplaceHtml(title = undefined) {
        this.activeWorkspaceTitle.innerHTML = title
            ?? (this.activeWorkplace?.title ?? "");
    }

    hasActiveWorkspace() {
        return JSON.stringify(this.activeWorkplace) !== '{}';
    }
}
