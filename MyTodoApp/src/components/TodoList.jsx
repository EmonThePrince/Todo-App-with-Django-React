// TodoList.jsx
import React from 'react';
import TodoContainer from './TodoContainer.jsx';

function TodoList({ todos, toggleTodo, updateTodo, deleteTodo }) {
  return (
    <ul className="divide-y divide-gray-300">
      {todos.map((todo, index) => (
        <TodoContainer
          key={index}
          todo={todo}
          index={index}
          toggleTodo={toggleTodo}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
