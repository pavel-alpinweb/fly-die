import React from 'react';

const TodoInput = (props) => {
    return (
        <input {...props} onKeyDown={props.createNewItem} onChange={props.handleChange}/>
    );
};

export default TodoInput;