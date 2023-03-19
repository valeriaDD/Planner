export class Task {
    constructor(title, date, workspace = "", complete = false, id = new Date().getTime()) {
        this.id = id;
        this.title = title;
        this.workspace = workspace;
        this.date = date;
        this.complete = complete;
        this.overdue = !this.complete && this.date && new Date(this.date).getTime() < new Date().getTime();
    }

    getHtmlTemplate() {
        return `
                 <div 
                 class="task ${this.overdue ? 'task--overdue' : ''} ${this.complete ? 'task--done' : ''}">
                    <div class="task__checkbox">
                        <input type="checkbox" class="check" id="check${this.id}" ${this.complete ? "checked" : ''}/>
                        <label for="check${this.id}" class="label">
                            <svg width="40" height="40" viewbox="0 0 100 100">
                                <rect x="30" y="25" width="55" height="55" stroke="#ffb578" fill="none"/>
                                <g transform="translate(0,-952.36222)">
                                    <path d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                                          stroke="#ffb578" stroke-width="2" fill="none" class="path1"/>
                                </g>
                            </svg>
                        </label>
                    </div>
                    <input class="task__title" value="${this.title}">
                    <input type="date" class="task__date" value="${this.date}">
                    <div class="task__actions">
                        <i class="task__actions--delete bi bi-x-lg"></i>
                    </div>
                </div>
        `
    }
}