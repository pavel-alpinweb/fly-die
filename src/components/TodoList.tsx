import React from 'react';
import {todoStore} from "../store/todoStore.ts";
import {observer} from "mobx-react-lite";
import TodoItem from "./TodoItem.tsx";

const TodoList = observer(() => {
    return (
        <div>
            <p>{todoStore.completedTodosCount}</p>
            <ul>
                {todoStore.todos.map((todo) => <TodoItem key={todo.task} todo={todo}/>)}
            </ul>
        </div>
    );
});

export default TodoList;