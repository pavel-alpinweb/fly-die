import React from 'react';
import {observer} from "mobx-react-lite";

const TodoItem = observer(({todo}) => {
    return (
        <li>{todo.task}</li>
    );
});

export default TodoItem;