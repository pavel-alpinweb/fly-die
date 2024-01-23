import {action, computed, makeObservable, observable} from "mobx";

interface Todo {
    task: string,
    completed: false,
    assignee: null,
}

class TodoStore {
    todos: Todo[] = [];

    constructor() {
        makeObservable(this, {
            todos: observable,
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