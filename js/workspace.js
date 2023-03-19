export class Workplace {
    id = undefined;
    title = undefined

    constructor(id =  new Date().getTime(), title = undefined) {
        this.id = id;
        this.title = title ?? this.computeTitle();
    }

    computeTitle() {
        return "Untitled " + (
            JSON.parse(localStorage.getItem('workspaces'))
                ? JSON.parse(localStorage.getItem('workspaces'))?.length
                : 0
        );
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
