import {action, computed, makeObservable, observable} from "mobx";

declare global {
    interface Todo {
        task: string,
        completed: false,
        assignee: null,
    }
}

export class TodoStore {
    todos: Todo[] = [{
        task: 'start',
        completed: false,
        assignee: null,
    }];
    heading = 'Head';

    constructor() {
        makeObservable(this, {
            todos: observable,
            heading: observable,
            addTodo: action,
            completedTodosCount: computed,
        });
    }

    get completedTodosCount(): number {
        return this.todos.filter(
            todo => todo.completed
        ).length;
    }

    addTodo(task: string) {
        this.todos.push({
            task: task,
            completed: false,
            assignee: null
        });
    }
}

export const todoStore = new TodoStore();