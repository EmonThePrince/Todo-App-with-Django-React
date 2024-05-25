// TodoContainer.jsx
import React from 'react';

function TodoContainer({ todo, index, toggleTodo, updateTodo, deleteTodo }) {
  return (
    <li className="flex items-center py-2">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(index)}
        className="mr-4"
      />
      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
        {todo.text}
      </span>
      <button
        disabled = {todo.completed}
        onClick={() => updateTodo(index)}
        className="ml-4 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 focus:outline-none"
      >
        Update
      </button>
      <button
        onClick={() => deleteTodo(index)}
        className="ml-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none"
      >
        Delete
      </button>
    </li>
  );
}

export default TodoContainer;
