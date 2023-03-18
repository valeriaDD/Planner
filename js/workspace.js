export class Workplace {
    id = undefined;
    title = undefined

    constructor(id = undefined, title = undefined) {
        this.id = id ?? localStorage.getItem('workspaces')
            ? JSON.parse(localStorage.getItem('workspaces')).length
            : 0
        this.title = title ?? "Untitled" + this.id;
    }

    getHtmlTemplate() {
        return `
            <div class="workspace">
               <input class="workspace__input" value="${this.title}">
                <i class="workspace__delete-action bi bi-x"></i>
            </div> 
        `
    }
}
