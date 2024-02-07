import TodoList from "./components/TodoList.tsx";
import TodoInput from "./components/TodoInput.tsx";
import {todoStore} from "./store/todoStore.ts";
import {useState} from "react";

function App() {
  const [name, setName] = useState('');

  const handleChange = (event) => {
      setName(event.target.value);
  };

  const createNewItem = (event) => {
      if (event.key === 'Enter') {
          todoStore.addTodo(name);
          setName('');
      }
  };


  return (
    <div>
        <h1 style={{ textAlign: 'center' }}>Todo with MobX</h1>
        <TodoInput
            type="text"
            createNewItem={createNewItem}
            handleChange={handleChange}
            placeholder="Название пункта"
        />
        <TodoList/>
    </div>
  )
}

export default App
